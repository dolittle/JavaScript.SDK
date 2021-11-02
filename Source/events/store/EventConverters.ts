// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { DateTime } from 'luxon';
import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb';
import {
    CommittedEvent as PbCommittedEvent,
    CommittedAggregateEvents as PbCommittedAggregateEvents
} from '@dolittle/runtime.contracts/Events/Committed_pb';
import {
    UncommittedEvent as PbUncommittedEvent,
    UncommittedAggregateEvents as PbUncommittedAggregateEvents
} from '@dolittle/runtime.contracts/Events/Uncommitted_pb';

import { EventType } from '@dolittle/sdk.artifacts';
import { eventTypes, guids, executionContexts } from '@dolittle/sdk.protobuf';

import { AggregateRootId, AggregateRootVersion, EventLogSequenceNumber, EventSourceId } from '../index';
import { CommittedEvent as SdkCommittedEvent } from './CommittedEvent';
import { CommittedAggregateEvent as SdkCommittedAggregateEvent } from './CommittedAggregateEvent';
import { MissingExecutionContext } from './MissingExecutionContext';


/**
 * Represents converter helpers for converting to relevant event types for transmitting over Grpc.
 */
export class EventConverters {

    /**
     * Creates an uncommitted event from given parameters.
     * @param {*} event Event content to constructor with.
     * @param {EventSourceId} eventSourceId The unique identifier of the event source that the event is originating from.
     * @param {EventType} eventType The event type.
     * @param {boolean} isPublic Whether or not it is a public event
     * @returns {UncommittedEvent} Constructed uncommitted event.
     */
    static getUncommittedEventFrom(event: any, eventSourceId: EventSourceId, eventType: EventType, isPublic: boolean): PbUncommittedEvent {
        const uncommittedEvent = new PbUncommittedEvent();
        uncommittedEvent.setEventtype(eventTypes.toProtobuf(eventType));
        uncommittedEvent.setEventsourceid(eventSourceId.value);
        uncommittedEvent.setPublic(isPublic);
        uncommittedEvent.setContent(JSON.stringify(event));
        return uncommittedEvent;
    }

    /**
     * Creates an uncommitted embedding event (aka an event without an eventsourceid) from given parameters.
     * @param {*} event Event content to constructor with.
     * @param {EventType} eventType The event type.
     * @param {boolean} isPublic Whether or not it is a public event
     * @returns {UncommittedEvent} Constructed uncommitted event.
     */
    static getUncommittedEmbeddingEventFrom(event: any, eventType: EventType, isPublic: boolean): PbUncommittedEvent {
        const uncommittedEvent = new PbUncommittedEvent();
        uncommittedEvent.setEventtype(eventTypes.toProtobuf(eventType));
        uncommittedEvent.setPublic(isPublic);
        uncommittedEvent.setContent(JSON.stringify(event));
        return uncommittedEvent;
    }

    /**
     * Creates an uncommitted aggregate event from given parameters.
     * @param {*} event Event content to constructor with.
     * @param {EventSourceId} eventSourceId The unique identifier of the event source that the event is originating from.
     * @param {EventType} eventType Artifact of the event type.
     * @param {boolean} isPublic Whether or not it is a public event
     * @returns {PbUncommittedAggregateEvents.UncommittedAggregateEvent} Constructed uncommitted event.
     */
    static getUncommittedAggregateEventFrom(event: any, eventType: EventType, isPublic: boolean): PbUncommittedAggregateEvents.UncommittedAggregateEvent {
        const uncommittedAggregateEvent = new PbUncommittedAggregateEvents.UncommittedAggregateEvent();
        uncommittedAggregateEvent.setEventtype(eventTypes.toProtobuf(eventType));
        uncommittedAggregateEvent.setPublic(isPublic);
        uncommittedAggregateEvent.setContent(JSON.stringify(event));
        return uncommittedAggregateEvent;
    }


    static toSDKAggregate(aggregateRootId: AggregateRootId, eventSourceId: EventSourceId, aggregateRootVersion: AggregateRootVersion, input: PbCommittedAggregateEvents.CommittedAggregateEvent): SdkCommittedAggregateEvent {
        const executionContext = input.getExecutioncontext();
        if (!executionContext) {
            throw new MissingExecutionContext();
        }

        const committedEvent = new SdkCommittedAggregateEvent(
            EventLogSequenceNumber.from(input.getEventlogsequencenumber()),
            DateTime.fromJSDate((input.getOccurred()?.toDate() || new Date())),
            eventSourceId,
            aggregateRootId,
            aggregateRootVersion,
            executionContexts.toSDK(executionContext),
            eventTypes.toSDK(input.getEventtype()),
            JSON.parse(input.getContent()),
            input.getPublic()
        );
        return committedEvent;
    }

    /**
     * Convert a protobuf committed event to SDK representation
     * @param {PbCommittedEvent} input Committed event.
     * @returns {SdkCommittedEvent} SDK representation.
     */
    static toSDK(input: PbCommittedEvent): SdkCommittedEvent {

        const executionContext = input.getExecutioncontext();
        if (!executionContext) {
            throw new MissingExecutionContext();
        }

        const committedEvent = new SdkCommittedEvent(
            EventLogSequenceNumber.from(input.getEventlogsequencenumber()),
            DateTime.fromJSDate((input.getOccurred()?.toDate() || new Date())),
            EventSourceId.from(input.getEventsourceid()),
            executionContexts.toSDK(executionContext),
            eventTypes.toSDK(input.getEventtype()),
            JSON.parse(input.getContent()),
            input.getPublic(),
            input.getExternal(),
            EventLogSequenceNumber.from(input.getExternaleventlogsequencenumber()),
            DateTime.fromJSDate(input.getExternaleventreceived()?.toDate() || new Date())
        );
        return committedEvent;
    }

    /**
     * Convert a SDK committed event to protobuf representation
     * @param {SdkCommittedEvent} input Committed event.
     * @returns {PbCommittedEvent} Protobuf representation.
     */
    static toProtobuf(input: SdkCommittedEvent): PbCommittedEvent {
        const occurred = new Timestamp();
        occurred.fromDate(input.occurred.toJSDate());
        const externalEventReceived = new Timestamp();
        externalEventReceived.fromDate(input.externalEventReceived.toJSDate());

        const committedEvent = new PbCommittedEvent();
        committedEvent.setEventlogsequencenumber(input.eventLogSequenceNumber.value);
        committedEvent.setOccurred(occurred);
        committedEvent.setEventsourceid(input.eventSourceId.value);
        committedEvent.setExecutioncontext(executionContexts.toProtobuf(input.executionContext));
        committedEvent.setEventtype(eventTypes.toProtobuf(input.type));
        committedEvent.setContent(JSON.stringify(input.content));
        committedEvent.setPublic(input.isPublic);
        committedEvent.setExternal(input.isExternal);
        committedEvent.setExternaleventlogsequencenumber(input.externalEventLogSequenceNumber.value);
        committedEvent.setExternaleventreceived(externalEventReceived);
        return committedEvent;
    }
}
