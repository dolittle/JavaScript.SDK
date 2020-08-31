// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { DateTime } from 'luxon';
import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb';
import { CommittedEvent as PbCommittedEvent } from '@dolittle/runtime.contracts/Runtime/Events/Committed_pb';
import { UncommittedEvent as PbUncommittedEvent } from '@dolittle/runtime.contracts/Runtime/Events/Uncommitted_pb';

import { Artifact } from '@dolittle/sdk.artifacts';
import { artifacts, guids, executionContexts } from '@dolittle/sdk.protobuf';

import { CommittedEvent as SdkCommittedEvent, EventSourceId, MissingExecutionContext, EventLogSequenceNumber } from './index';

/**
 * Represents converter helpers for converting to relevant event types for transmitting over Grpc.
 */
export class EventConverters {

    /**
     * Creates an uncommitted event from given parameters.
     * @param {*} event Event content to constructor with.
     * @param {EventSourceId} eventSourceId The unique identifier of the event source that the event is originating from.
     * @param {Artifact} artifact Artifact of the event type.
     * @param {boolean} isPublic Whether or not it is a public event
     * @returns {UncommittedEvent} Constructed uncommitted event.
     */
    static getUncommittedEventFrom(event: any, eventSourceId: EventSourceId, artifact: Artifact, isPublic: boolean): PbUncommittedEvent {
        const uncommittedEvent = new PbUncommittedEvent();
        uncommittedEvent.setArtifact(artifacts.toProtobuf(artifact));
        uncommittedEvent.setEventsourceid(guids.toProtobuf(eventSourceId.value));
        uncommittedEvent.setPublic(isPublic);
        uncommittedEvent.setContent(JSON.stringify(event));
        return uncommittedEvent;
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
            EventSourceId.from(guids.toSDK(input.getEventsourceid())),
            executionContexts.toSDK(executionContext),
            artifacts.toSDK(input.getType()),
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
        committedEvent.setEventsourceid(guids.toProtobuf(input.eventSourceId.value));
        committedEvent.setExecutioncontext(executionContexts.toProtobuf(input.executionContext));
        committedEvent.setType(artifacts.toProtobuf(input.type));
        committedEvent.setContent(JSON.stringify(input.content));
        committedEvent.setPublic(input.isPublic);
        committedEvent.setExternal(input.isExternal);
        committedEvent.setExternaleventlogsequencenumber(input.externalEventLogSequenceNumber.value);
        committedEvent.setExternaleventreceived(externalEventReceived);
        return committedEvent;
    }
}
