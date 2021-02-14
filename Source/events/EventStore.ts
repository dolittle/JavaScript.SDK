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

import { CommittedEvents } from './CommittedEvents';
import { IEventStore } from './IEventStore';
import { EventSourceId } from './EventSourceId';
import { UncommittedEvent } from './UncommittedEvent';
import { EventConverters } from './EventConverters';
import { CommitEventsResult } from './CommitEventsResult';
import { Guid } from '@dolittle/rudiments';
import { AggregateRootId } from './AggregateRootId';
import { CommitForAggregateBuilder } from './CommitForAggregateBuilder';
import { CommittedAggregateEvents } from './CommittedAggregateEvents';
import { UncommittedAggregateEvents } from './UncommittedAggregateEvents';

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
    commit(event: any, eventSourceId: EventSourceId | Guid | string, eventType?: EventType | EventTypeId | Guid | string, cancellation?: Cancellation): Promise<CommitEventsResult>;
    commit(eventOrEvents: UncommittedEvent | UncommittedEvent[], cancellation?: Cancellation): Promise<CommitEventsResult>;
    commit(eventOrEvents: any, eventSourceIdOrCancellation?: EventSourceId | Guid | string | Cancellation, eventType?: EventType | EventTypeId | Guid | string, cancellation?: Cancellation): Promise<CommitEventsResult> {
        if (this.isUncommittedEventOrEvents(eventOrEvents)) {
            return this.commitInternal(this.asArray(eventOrEvents), eventSourceIdOrCancellation as Cancellation);
        }
        const eventSourceId = eventSourceIdOrCancellation as Guid | string;
        return this.commitInternal([this.toUncommittedEvent(eventOrEvents, eventSourceId, eventType, false)], cancellation);
    }

    /** @inheritdoc */
    commitPublic(event: any, eventSourceId: EventSourceId | Guid | string, eventType?: EventType | EventTypeId | Guid | string, cancellation?: Cancellation): Promise<CommitEventsResult> {
        const events: UncommittedEvent[] = [this.toUncommittedEvent(event, eventSourceId, eventType, true)];
        return this.commitInternal(events, cancellation);
    }

    /** @inheritdoc */
    async commitForAggregate(uncommittedAggregateEvents: UncommittedAggregateEvents, cancellation?: Cancellation): Promise<CommittedAggregateEvents> {
        this._logger.info('Commit for aggregate');
        return new CommittedAggregateEvents(uncommittedAggregateEvents.eventSourceId, uncommittedAggregateEvents.aggregateRootId, ...[]);
    }

    /** @inheritdoc */
    forAggregate(aggregateRootId: AggregateRootId): CommitForAggregateBuilder {
        return new CommitForAggregateBuilder(this, this._eventTypes, aggregateRootId, this._logger);
    }

    /** @inheritdoc */
    fetchForAggregate(aggregateRootId: AggregateRootId, eventSourceId: EventSourceId): CommittedAggregateEvents {
        return new CommittedAggregateEvents(eventSourceId, aggregateRootId, ...[]);
    }


    private async commitInternal(events: UncommittedEvent[], cancellation = Cancellation.default): Promise<CommitEventsResult> {
        const uncommittedEvents = events.map(event =>
            EventConverters.getUncommittedEventFrom(
                event.content,
                event.eventSourceId,
                this._eventTypes.resolveFrom(event.content, event.eventType),
                !!event.public));

        const request = new CommitEventsRequest();
        request.setCallcontext(callContexts.toProtobuf(this._executionContext));
        request.setEventsList(uncommittedEvents);
        this._logger.debug('Committing events');

        return reactiveUnary(this._eventStoreClient, this._eventStoreClient.commit, request, cancellation)
            .pipe(map(response => {
                const committedEvents = new CommittedEvents(...response.getEventsList().map(event => EventConverters.toSDK(event)));
                return new CommitEventsResult(committedEvents, failures.toSDK(response.getFailure()));
            })).toPromise();
    }

    private toUncommittedEvent(content: any, eventSourceId: EventSourceId | Guid | string, eventTypeOrId?: EventType | EventTypeId | Guid | string, isPublic = false): UncommittedEvent {
        let eventType: EventType | EventTypeId | undefined;
        if (eventTypeOrId !== undefined) {
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

    private isUncommittedEvent(event: any): event is UncommittedEvent {
        return event.eventSourceId && event.content;
    }

    private isArrayOfUncommittedEvents(events: any): events is UncommittedEvent[] {
        return Array.isArray(events) && events.length > 0 && this.isUncommittedEvent(events[0]);
    }

    private isUncommittedEventOrEvents(eventOrEvents: any): eventOrEvents is UncommittedEvent | UncommittedEvent[] {
        return this.isUncommittedEvent(eventOrEvents) || this.isArrayOfUncommittedEvents(eventOrEvents);
    }

    private asArray<T = any>(obj: T | T[]): T[] {
        return Array.isArray(obj) ? obj : [obj];
    }
}
