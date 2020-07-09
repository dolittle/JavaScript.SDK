// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import '@dolittle/sdk.protobuf';

import { ArtifactId, Artifact, IArtifacts } from '@dolittle/sdk.artifacts';
import { IExecutionContextManager } from '@dolittle/sdk.execution';

import { IEventStore } from './IEventStore';
import { CommittedEvent } from './CommittedEvent';
import { CommittedEvents } from './CommittedEvents';
import { CommitEventsResponse } from './CommitEventsResponse';
import { EventSourceId } from './EventSourceId';
import { EventsAndArtifactsAreNotTheSameSize } from './EventsAndArtifactsAreNotTheSameSize';

import { EventStoreClient } from '@dolittle/runtime.contracts/Runtime/Events/EventStore_grpc_pb';
import { UncommittedEvent } from '@dolittle/runtime.contracts/Runtime/Events/Uncommitted_pb';
import { CommitEventsRequest } from '@dolittle/runtime.contracts/Runtime/Events/EventStore_pb';

import { Guid } from '@dolittle/rudiments';
import { InconsistentUseOfArrayForEventsAndArtifacts } from './InconsistentUseOfArrayForEventsAndArtifacts';

import { EventConverters } from './EventConverters';
import { callContexts } from '@dolittle/sdk.protobuf';

import { ServiceError } from 'grpc';

import { Logger } from 'winston';

import { failures } from '@dolittle/sdk.protobuf';
import { MissingEventsFromRuntime } from './MissingEventsFromRuntime';

import { Cancellation, reactiveUnary } from '@dolittle/sdk.services';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Represents an implementation of {IEventStore}
 */
export class EventStore implements IEventStore {
    constructor(
        private _eventStoreClient: EventStoreClient,
        private _artifacts: IArtifacts,
        private _executionContextManager: IExecutionContextManager,
        private _logger: Logger) {
    }

    /** @inheritdoc */
    async commit(event: any, eventSourceId: EventSourceId, artifactId?: string | string[] | Artifact | ArtifactId, cancellation?: Cancellation): Promise<CommitEventsResponse>;
    async commit(events: any[], eventSourceId: EventSourceId, artifactIds?: string | string[] | Artifact[] | ArtifactId[], cancellation?: Cancellation): Promise<CommitEventsResponse>;
    async commit(input: any | any[], eventSourceId: EventSourceId, inputId?: string | string[] | Artifact | Artifact[] | ArtifactId | ArtifactId[], cancellation: Cancellation = Cancellation.default): Promise<CommitEventsResponse> {
        this._logger.debug('Commit:', input);
        return this.commitInternal(false, input, eventSourceId, inputId);
    }


    /** @inheritdoc */
    commitPublic(event: any, eventSourceId: EventSourceId, artifactId?: Artifact | ArtifactId, cancellation?: Cancellation): Promise<CommitEventsResponse>;
    commitPublic(events: any[], eventSourceId: EventSourceId, artifactIds?: Artifact[] | ArtifactId[], cancellation?: Cancellation): Promise<CommitEventsResponse>;
    commitPublic(input: any | any[], eventSourceId: EventSourceId, inputId?: Artifact | Artifact[] | ArtifactId | ArtifactId[], cancellation: Cancellation = Cancellation.default): Promise<CommitEventsResponse> {
        this._logger.debug('Commit public:', input);
        return this.commitInternal(true, input, eventSourceId, inputId);
    }

    private async commitInternal(isPublic: boolean, input: any | any[], eventSourceId: EventSourceId, inputId?: string | string[] | Artifact | Artifact[] | ArtifactId | ArtifactId[]): Promise<CommitEventsResponse> {
        const uncommittedEvents: UncommittedEvent[] = [];
        const isEventArray = Array.isArray(input);
        const isArtifactArray = Array.isArray(inputId);

        this.throwIfEventAndArtifactTypesAreInconsistentOnSingleOrArray(isEventArray, isArtifactArray, input, inputId);

        if (isEventArray && inputId) {
            this.throwIfEventsArrayAndArtifactsArrayAreNotEqualInLength(inputId, input);

            input.forEach((event: any, index: number) => {
                const artifactOrId = (inputId as [])[index];
                uncommittedEvents.push(EventConverters.getUncommittedEventFrom(event, eventSourceId, this._artifacts.resolveFrom(input, artifactOrId), false));
            });
        } else {
            uncommittedEvents.push(EventConverters.getUncommittedEventFrom(input, eventSourceId, this._artifacts.resolveFrom(input, inputId as any), false));
        }

        const request = new CommitEventsRequest();
        request.setCallcontext(callContexts.toProtobuf(this._executionContextManager.current));
        request.setEventsList(uncommittedEvents);

        const cancellation = new Subject<void>();

        return reactiveUnary(this._eventStoreClient, this._eventStoreClient.commit, request, cancellation)
            .pipe(map(response => {
                const committedEvents = new CommittedEvents(...response.getEventsList().map(event => EventConverters.toSDK(event)));
                return new CommitEventsResponse(committedEvents, failures.toSDK(response.getFailure()));
            })).toPromise();
    }

    private throwIfEventsArrayAndArtifactsArrayAreNotEqualInLength(inputId: string | string[] | Artifact | Artifact[] | Guid | ArtifactId[] | undefined, input: any) {
        if (inputId && Array.isArray(inputId)) {
            if (input.length !== inputId.length) {
                throw new EventsAndArtifactsAreNotTheSameSize(input.length, inputId.length);
            }
        }
    }

    private throwIfEventAndArtifactTypesAreInconsistentOnSingleOrArray(isEventArray: boolean, isArtifactArray: boolean, input: any, inputId: string | string[] | Artifact | Artifact[] | Guid | ArtifactId[] | undefined) {
        if (isEventArray !== isArtifactArray) {
            throw new InconsistentUseOfArrayForEventsAndArtifacts(input, inputId);
        }
    }
}
