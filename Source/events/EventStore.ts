// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';
import { map } from 'rxjs/operators';

import { callContexts, failures } from '@dolittle/sdk.protobuf';
import { EventType, EventTypeId, IEventTypes } from '@dolittle/sdk.artifacts';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { Cancellation } from '@dolittle/sdk.resilience';
import { reactiveUnary } from '@dolittle/sdk.services';

import { EventStoreClient } from '@dolittle/runtime.contracts/Runtime/Events/EventStore_grpc_pb';
import { CommitEventsRequest, CommitEventsResponse as PbCommitEventsResponse } from '@dolittle/runtime.contracts/Runtime/Events/EventStore_pb';

import { CommittedEvents } from './CommittedEvents';
import { IEventStore } from './IEventStore';
import { EventSourceId } from './EventSourceId';
import { UncommittedEvent } from './UncommittedEvent';
import { EventConverters } from './EventConverters';
import { CommitEventsResponse } from './CommitEventsResponse';
import { Guid } from '@dolittle/rudiments';

/**
 * Represents an implementation of {@link IEventStore}
 */
export class EventStore implements IEventStore {

    /**
     * Initializes a new instance of {@link EventStore}.
     * @param {EventStoreClient} _eventStoreClient The client to use for connecting to the event store.
     * @param {IEventTypes} _eventTypes Event types system for working with event types.
     * @param {ExecutionContext} _executionContext The execution context.
     * @param {Logger} _logger Logger for logging.
     */
    constructor(
        private _eventStoreClient: EventStoreClient,
        private _eventTypes: IEventTypes,
        private _executionContext: ExecutionContext,
        private _logger: Logger) {
    }

    /** @inheritdoc */
    commit(event: any, eventSourceId: Guid | string, eventType?: EventType | Guid | string, cancellation?: Cancellation): Promise<CommitEventsResponse>;
    commit(events: UncommittedEvent[], cancellation?: Cancellation): Promise<CommitEventsResponse>;
    commit(eventOrEvents: any, eventSourceIdOrCancellation?: Guid | string | Cancellation, eventType?: EventType | Guid | string, cancellation?: Cancellation): Promise<CommitEventsResponse> {
        if (this.isArrayOfUncommittedEvents(eventOrEvents)) {
            return this.commitInternal(eventOrEvents, eventSourceIdOrCancellation as Cancellation);
        }
        const eventSourceId = eventSourceIdOrCancellation as Guid | string;
        return this.commitInternal([this.toUncommittedEvent(eventOrEvents, eventSourceId, eventType, false)], cancellation);
    }

    /** @inheritdoc */
    commitPublic(event: any, eventSourceId: Guid | string, eventType?: EventType | Guid | string, cancellation?: Cancellation): Promise<CommitEventsResponse> {
        const events: UncommittedEvent[] = [this.toUncommittedEvent(event, eventSourceId, eventType, true)];
        return this.commitInternal(events, cancellation);
    }

    private isArrayOfUncommittedEvents(eventOrEvents: any): eventOrEvents is UncommittedEvent[] {
        return Array.isArray(eventOrEvents) && eventOrEvents.length > 0 && eventOrEvents[0].eventSourceId && eventOrEvents[0].content;
    }

    private async commitInternal(events: UncommittedEvent[], cancellation = Cancellation.default): Promise<CommitEventsResponse> {
        const uncommittedEvents = events.map(event =>
            EventConverters.getUncommittedEventFrom(
                event.content,
                event.eventSourceId,
                this._eventTypes.resolveFrom(event.content, event.eventType),
                !!event.public));

        const request = new CommitEventsRequest();
        request.setCallcontext(callContexts.toProtobuf(this._executionContext));
        request.setEventsList(uncommittedEvents);

        return reactiveUnary(this._eventStoreClient, this._eventStoreClient.commit, request, cancellation)
            .pipe(map(response => {
                const committedEvents = new CommittedEvents(...response.getEventsList().map(event => EventConverters.toSDK(event)));
                return new CommitEventsResponse(committedEvents, failures.toSDK(response.getFailure()));
            })).toPromise();
    }

    private toUncommittedEvent(content: any, eventSourceId: Guid | string, eventTypeOrId?: EventType | Guid | string, isPublic = false): UncommittedEvent {
        let eventType: EventType | EventTypeId | undefined;
        if (eventTypeOrId != null) {
            if (eventTypeOrId instanceof EventType) eventType = eventTypeOrId;
            else eventType = EventTypeId.from(eventTypeOrId);
        }
        return {
            content,
            eventSourceId: EventSourceId.from(eventSourceId),
            eventType,
            public: isPublic
        };
    }
}
