// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { map } from 'rxjs/operators';
import { Logger } from 'winston';

import { Guid } from '@dolittle/rudiments';

import { ExecutionContext } from '@dolittle/sdk.execution';
import { Cancellation } from '@dolittle/sdk.resilience';
import { reactiveUnary } from '@dolittle/sdk.services';

import { Failure } from '@dolittle/contracts/Protobuf/Failure_pb';
import { Aggregate } from '@dolittle/runtime.contracts/Events/Aggregate_pb';
import { CommittedAggregateEvents as PbCommittedAggregatedEvents } from '@dolittle/runtime.contracts/Events/Committed_pb';
import { EventStoreClient } from '@dolittle/runtime.contracts/Events/EventStore_grpc_pb';
import { CommitAggregateEventsRequest, CommitEventsRequest, FetchForAggregateRequest } from '@dolittle/runtime.contracts/Events/EventStore_pb';
import { UncommittedAggregateEvents as PbUncommittedAggregateEvents } from '@dolittle/runtime.contracts/Events/Uncommitted_pb';

import { AggregateRootId } from '../AggregateRootId';
import { AggregateRootVersion } from '../AggregateRootVersion';
import { EventSourceId } from '../EventSourceId';
import { EventType } from '../EventType';
import { EventTypeId } from '../EventTypeId';
import { IEventTypes } from '../IEventTypes';
import { CommitForAggregateBuilder } from './builders/CommitForAggregateBuilder';
import { CommitAggregateEventsResult } from './CommitAggregateEventsResult';
import { CommitEventsResult } from './CommitEventsResult';
import { CommittedAggregateEvent } from './CommittedAggregateEvent';
import { CommittedAggregateEvents } from './CommittedAggregateEvents';
import { CommittedEvents } from './CommittedEvents';
import { EventConverters } from './EventConverters';
import { IEventStore } from './IEventStore';
import { UncommittedAggregateEvents } from './UncommittedAggregateEvents';
import { UncommittedEvent } from './UncommittedEvent';

import '@dolittle/sdk.protobuf';

/**
 * Represents an implementation of {@link IEventStore}.
 */
export class EventStore extends IEventStore {

    /**
     * Initializes a new instance of {@link EventStore}.
     * @param {EventStoreClient} _eventStoreClient - The client to use for connecting to the event store.
     * @param {IEventTypes} _eventTypes - Event types system for working with event types.
     * @param {ExecutionContext} _executionContext - The execution context.
     * @param {Logger} _logger - Logger for logging.
     */
    constructor(
        private _eventStoreClient: EventStoreClient,
        private _eventTypes: IEventTypes,
        private _executionContext: ExecutionContext,
        private _logger: Logger) {
        super();
    }

    /** @inheritdoc */
    commit(event: any, eventSourceId: EventSourceId | Guid | string, eventType?: EventType | EventTypeId | Guid | string, cancellation?: Cancellation): Promise<CommitEventsResult>;
    commit(eventOrEvents: UncommittedEvent | UncommittedEvent[], cancellation?: Cancellation): Promise<CommitEventsResult>;
    commit(eventOrEvents: any, eventSourceIdOrCancellation?: EventSourceId | Guid | string | Cancellation, eventType?: EventType | EventTypeId | Guid | string, cancellation?: Cancellation): Promise<CommitEventsResult> {
        if (this.isUncommittedEventOrEvents(eventOrEvents)) {
            return this.commitInternal(this.asArray(eventOrEvents), eventSourceIdOrCancellation as Cancellation);
        }
        const eventSourceId = eventSourceIdOrCancellation as EventSourceId | Guid | string;
        return this.commitInternal([this.toUncommittedEvent(eventOrEvents, eventSourceId, eventType, false)], cancellation);
    }

    /** @inheritdoc */
    commitPublic(event: any, eventSourceId: EventSourceId | Guid | string, eventType?: EventType | EventTypeId | Guid | string, cancellation?: Cancellation): Promise<CommitEventsResult> {
        const events: UncommittedEvent[] = [this.toUncommittedEvent(event, eventSourceId, eventType, true)];
        return this.commitInternal(events, cancellation);
    }

    /** @inheritdoc */
    /** @inheritdoc */
    commitForAggregate(event: any, eventSourceId: EventSourceId | Guid | string, aggregateRootId: AggregateRootId, expectedAggregateRootVersion: AggregateRootVersion, eventType?: EventType | EventTypeId | Guid | string, cancellation?: Cancellation): Promise<CommitAggregateEventsResult>;
    commitForAggregate(events: UncommittedAggregateEvents, cancellation?: Cancellation): Promise<CommitAggregateEventsResult>;
    commitForAggregate(eventOrEvents: any, eventSourceIdOrCancellation?: EventSourceId | Guid | string | Cancellation, aggregateRootId?: AggregateRootId, expectedAggregateRootVersion?: AggregateRootVersion, eventType?: EventType | EventTypeId | Guid | string, cancellation?: Cancellation): Promise<CommitAggregateEventsResult> {
        if (this.isUncommittedAggregateEvents(eventOrEvents)) {
            return this.commitAggregateInternal(eventOrEvents, eventSourceIdOrCancellation as Cancellation);
        }
        const eventSourceId = eventSourceIdOrCancellation as EventSourceId | Guid | string;
        return this.commitAggregateInternal(
            UncommittedAggregateEvents.from(
                eventSourceId,
                aggregateRootId!,
                expectedAggregateRootVersion!,
                {
                    content: eventOrEvents,
                    eventType: eventType instanceof EventType ? eventType : EventTypeId.from(eventType!),
                    public: false
                }),
            cancellation);
    }

    /** @inheritdoc */
    forAggregate(aggregateRootId: AggregateRootId): CommitForAggregateBuilder {
        return new CommitForAggregateBuilder(this, this._eventTypes, aggregateRootId, this._logger);
    }

    /** @inheritdoc */
    fetchForAggregate(aggregateRootId: AggregateRootId, eventSourceId: EventSourceId, cancellation: Cancellation = Cancellation.default): Promise<CommittedAggregateEvents> {
        const request = new FetchForAggregateRequest();
        request.setCallcontext(this._executionContext.toCallContext());
        const aggregate = new Aggregate();
        aggregate.setAggregaterootid(aggregateRootId.value.toProtobuf());
        aggregate.setEventsourceid(eventSourceId.value);
        request.setAggregate(aggregate);

        return reactiveUnary(this._eventStoreClient, this._eventStoreClient.fetchForAggregate, request, cancellation)
            .pipe(map(response => {
                const events = response.getEvents();
                const failure = response.getFailure();
                const committedEvents = this.toCommittedAggregateEvents(aggregateRootId, eventSourceId, events, failure);
                return new CommittedAggregateEvents(eventSourceId, aggregateRootId, ...committedEvents);
            })).toPromise();
    }

    private async commitInternal(events: UncommittedEvent[], cancellation = Cancellation.default): Promise<CommitEventsResult> {
        const uncommittedEvents = events.map(event =>
            EventConverters.getUncommittedEventFrom(
                event.content,
                event.eventSourceId,
                this._eventTypes.resolveFrom(event.content, event.eventType),
                !!event.public));

        const request = new CommitEventsRequest();
        request.setCallcontext(this._executionContext.toCallContext());
        request.setEventsList(uncommittedEvents);
        this._logger.debug('Committing events');

        return reactiveUnary(this._eventStoreClient, this._eventStoreClient.commit, request, cancellation)
            .pipe(map(response => {
                const committedEvents = new CommittedEvents(...response.getEventsList().map(event => EventConverters.toSDK(event)));
                return new CommitEventsResult(committedEvents, response.getFailure()?.toSDK());
            })).toPromise();
    }

    private isUncommittedAggregateEvents(eventOrEvents: any): eventOrEvents is UncommittedAggregateEvents {
        return eventOrEvents instanceof UncommittedAggregateEvents && eventOrEvents.toArray().length > 0;
    }

    private async commitAggregateInternal(events: UncommittedAggregateEvents, cancellation = Cancellation.default): Promise<CommitAggregateEventsResult> {
        const uncommittedAggregateEvents: PbUncommittedAggregateEvents.UncommittedAggregateEvent[] = events.toArray().map(event =>
            EventConverters.getUncommittedAggregateEventFrom(
                event.content,
                this._eventTypes.resolveFrom(event.content, event.eventType),
                !!event.public));

        const eventSourceId = events.eventSourceId;
        const aggregateRootId = events.aggregateRootId;
        const request = new CommitAggregateEventsRequest();
        const pbEvents = new PbUncommittedAggregateEvents();
        pbEvents.setEventsList(uncommittedAggregateEvents);
        pbEvents.setAggregaterootid(aggregateRootId.value.toProtobuf());
        pbEvents.setEventsourceid(events.eventSourceId.value);
        pbEvents.setExpectedaggregaterootversion(events.expectedAggregateRootVersion.value);
        request.setCallcontext(this._executionContext.toCallContext());
        request.setEvents(pbEvents);

        return reactiveUnary(this._eventStoreClient, this._eventStoreClient.commitForAggregate, request, cancellation)
            .pipe(map(response => {
                const events = response.getEvents();
                const failure = response.getFailure();

                const committedEvents = this.toCommittedAggregateEvents(aggregateRootId, eventSourceId, events, failure);
                return new CommitAggregateEventsResult(committedEvents, failure?.toSDK());
            })).toPromise();
    }

    private toCommittedAggregateEvents(aggregateRootId: AggregateRootId, eventSourceId: EventSourceId, events?: PbCommittedAggregatedEvents, failure?: Failure) {
        let convertedEvents: CommittedAggregateEvent[] = [];
        if (!failure && events) {
            const eventsList = events.getEventsList()!;
            const startVersion = events.getAggregaterootversion() - (eventsList.length - 1);

            convertedEvents = eventsList.map((event, index) => EventConverters.toSDKAggregate(
                aggregateRootId,
                eventSourceId,
                AggregateRootVersion.from(startVersion + index),
                event));
        } else {
            this._logger.error(`Problems with committed events for aggregate root '${aggregateRootId}' for events source id '${eventSourceId}' with reason '${failure?.getReason()}'`);
        }
        return new CommittedAggregateEvents(eventSourceId, aggregateRootId, ...convertedEvents);
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
