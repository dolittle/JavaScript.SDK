// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';
import { map } from 'rxjs/operators';

import { callContexts, failures } from '@dolittle/sdk.protobuf';
import { ArtifactId, Artifact, IArtifacts } from '@dolittle/sdk.artifacts';
import { IExecutionContextManager } from '@dolittle/sdk.execution';
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
     * @param {IArtifacts} _artifacts Artifacts system for working with artifacts.
     * @param {IExecutionContextManager} _executionContextManager For working with the execution context.
     * @param {Logger} _logger Logger for logging.
     */
    constructor(
        private _eventStoreClient: EventStoreClient,
        private _artifacts: IArtifacts,
        private _executionContextManager: IExecutionContextManager,
        private _logger: Logger) {
    }

    /** @inheritdoc */
    commit(event: any, eventSourceId: Guid | string, artifact?: Artifact | Guid | string, cancellation?: Cancellation): Promise<CommitEventsResponse>;
    commit(events: UncommittedEvent[], cancellation?: Cancellation): Promise<CommitEventsResponse>;
    commit(eventOrEvents: any, eventSourceIdOrCancellation?: Guid | string | Cancellation, artifact?: Artifact | Guid | string, cancellation?: Cancellation): Promise<CommitEventsResponse> {
        if (this.isArrayOfUncommittedEvents(eventOrEvents)) {
            return this.commitInternal(eventOrEvents, eventSourceIdOrCancellation as Cancellation);
        }
        const eventSourceId = eventSourceIdOrCancellation as Guid | string;
        return this.commitInternal([this.toUncommittedEvent(eventOrEvents, eventSourceId, artifact, false)], cancellation);
    }

    /** @inheritdoc */
    commitPublic(event: any, eventSourceId: Guid | string, artifact?: Artifact | Guid | string, cancellation?: Cancellation): Promise<CommitEventsResponse> {
        const events: UncommittedEvent[] = [this.toUncommittedEvent(event, eventSourceId, artifact, true)];
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
                this._artifacts.resolveFrom(event.content, event.artifact),
                !!event.public));

        const request = new CommitEventsRequest();
        request.setCallcontext(callContexts.toProtobuf(this._executionContextManager.current));
        request.setEventsList(uncommittedEvents);

        return reactiveUnary(this._eventStoreClient, this._eventStoreClient.commit, request, cancellation)
            .pipe(map(response => {
                const committedEvents = new CommittedEvents(...response.getEventsList().map(event => EventConverters.toSDK(event)));
                return new CommitEventsResponse(committedEvents, failures.toSDK(response.getFailure()));
            })).toPromise();
    }

    private toUncommittedEvent(content: any, eventSourceId: Guid | string, artifactOrId?: Artifact | Guid | string, isPublic = false): UncommittedEvent {
        let artifact: Artifact | ArtifactId | undefined;
        if (artifactOrId != null) {
            if (artifactOrId instanceof Artifact) artifact = artifactOrId;
            else artifact = ArtifactId.from(artifactOrId);
        }
        return {
            content,
            eventSourceId: EventSourceId.from(eventSourceId),
            artifact,
            public: isPublic
        };
    }
}
