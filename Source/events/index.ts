// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

export { EventTypesBuilder, EventTypesBuilderCallback } from './builders';

export {
    AggregateRootVersionIsOutOfOrder,
    CommitAggregateEventsResult,
    CommitEventsResult,
    CommitForAggregateBuilder,
    CommitForAggregateWithEventSourceAndExpectedVersionBuilder,
    CommitForAggregateWithEventSourceBuilder,
    CommittedAggregateEvent,
    CommittedAggregateEvents,
    CommittedEvent,
    CommittedEvents,
    EventBuilderMethodAlreadyCalled,
    EventContentNeedsToBeDefined,
    EventConverters,
    EventLogSequenceNumberIsOutOfOrder,
    EventStore,
    EventStoreBuilder,
    EventWasAppliedByOtherAggregateRoot,
    EventWasAppliedToOtherEventSource,
    IEventStore,
    MissingExecutionContext,
    UncommittedAggregateEvent,
    UncommittedAggregateEvents,
    UncommittedEvent
} from './store';

export { EventLogSequenceNumberMustBeAPositiveInteger } from './EventLogSequenceNumberMustBeAPositiveInteger';
export { AggregateRootId, AggregateRootIdLike } from './AggregateRootId';
export { AggregateRootVersion } from './AggregateRootVersion';
export { EventContext } from './EventContext';
export { EventLogSequenceNumber } from './EventLogSequenceNumber';
export { EventSourceId } from './EventSourceId';
export { MissingEventsFromRuntime } from './MissingEventsFromRuntime';
export { PartitionId } from './PartitionId';
export { ScopeId } from './ScopeId';
export { StreamId } from './StreamId';
export { EventType } from './EventType';
export { eventType } from './eventTypeDecorator';
export { EventTypeId, EventTypeIdLike } from './EventTypeId';
export { EventTypeAlias, EventTypeAliasLike } from './EventTypeAlias';
export { EventTypeMap } from './EventTypeMap';
export { EventTypeOptions } from './EventTypeOptions';
export { EventTypes } from './EventTypes';
export { EventTypesFromDecorators } from './EventTypesFromDecorators';
export { IEventTypes } from './IEventTypes';

export * as internal from './internal';
