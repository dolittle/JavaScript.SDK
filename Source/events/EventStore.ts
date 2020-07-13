// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { callContexts, failures } from '@dolittle/sdk.protobuf';
import { ArtifactId, Artifact, IArtifacts } from '@dolittle/sdk.artifacts';
import { IExecutionContextManager } from '@dolittle/sdk.execution';

import { IEventStore } from './IEventStore';
import { CommittedEvent } from './CommittedEvent';
import { CommittedEvents } from './CommittedEvents';
import { EventSourceId } from './EventSourceId';
import { EventsAndArtifactsAreNotTheSameSize } from './EventsAndArtifactsAreNotTheSameSize';

import { EventStoreClient } from '@dolittle/runtime.contracts/Runtime/Events/EventStore_grpc_pb';
import { UncommittedEvent } from '@dolittle/runtime.contracts/Runtime/Events/Uncommitted_pb';
import { CommitEventsRequest, CommitEventsResponse } from '@dolittle/runtime.contracts/Runtime/Events/EventStore_pb';

import { Guid } from '@dolittle/rudiments';
import { InconsistentUseOfArrayForEventsAndArtifacts } from './InconsistentUseOfArrayForEventsAndArtifacts';

import { EventConverters } from './EventConverters';

import { ServiceError } from 'grpc';

import { Logger } from 'winston';

import { MissingEventsFromRuntime } from './MissingEventsFromRuntime';

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
    async commit(event: any, eventSourceId: EventSourceId, artifactId?: string | Array<string> | Artifact | ArtifactId): Promise<CommittedEvent>;
    async commit(events: Array<any>, eventSourceId: EventSourceId, artifactIds?: string | Array<string> | Array<Artifact> | Array<ArtifactId>): Promise<CommittedEvents>;
    async commit(input: any | Array<any>, eventSourceId: EventSourceId, inputId?: string | Array<string> | Artifact | Array<Artifact> | ArtifactId | Array<ArtifactId>): Promise<CommittedEvent | CommittedEvents> {
        this._logger.debug('Commit:', input);
        return this.commitInternal(false, input, eventSourceId, inputId);
    }


    /** @inheritdoc */
    commitPublic(event: any, eventSourceId: EventSourceId, artifactId?: Artifact | ArtifactId): Promise<CommittedEvent>;
    commitPublic(events: Array<any>, eventSourceId: EventSourceId, artifactIds?: Array<Artifact> | Array<ArtifactId>): Promise<CommittedEvents>;
    commitPublic(input: any | Array<any>, eventSourceId: EventSourceId, inputId?: Artifact | Array<Artifact> | ArtifactId | Array<ArtifactId>): Promise<CommittedEvent | CommittedEvents> {
        this._logger.debug('Commit public:', input);
        return this.commitInternal(true, input, eventSourceId, inputId);
    }

    private async commitInternal(isPublic: boolean, input: any | Array<any>, eventSourceId: EventSourceId, inputId?: string | Array<string> | Artifact | Array<Artifact> | ArtifactId | Array<ArtifactId>): Promise<CommittedEvent | CommittedEvents> {
        const uncommittedEvents: Array<UncommittedEvent> = [];
        const isEventArray = Array.isArray(input);
        const isArtifactArray = Array.isArray(inputId);

        this.throwIfEventAndArtifactTypesAreInconsistentOnSingleOrArray(isEventArray, isArtifactArray, input, inputId);

        if (isEventArray && inputId) {
            this.throwIfEventsArrayAndArtifactsArrayAreNotEqualInLength(inputId, input);

            input.forEach((event: any, index: number) => {
                const artifactOrId = (inputId as [])[index];
                uncommittedEvents.push(EventConverters.getUncommittedEventFrom(event, eventSourceId, this._artifacts.resolveFrom(input, artifactOrId), false));
            });
        }
 else {
            uncommittedEvents.push(EventConverters.getUncommittedEventFrom(input, eventSourceId, this._artifacts.resolveFrom(input, inputId as any), false));
        }

        const request = new CommitEventsRequest();
        request.setCallcontext(callContexts.toProtobuf(this._executionContextManager.current));
        request.setEventsList(uncommittedEvents);

        const promise: Promise<any> = new Promise((resolve, reject) => {
            this._eventStoreClient.commit(request, (error: ServiceError | null, response?: CommitEventsResponse) => {
                if (this.handleAnyErrors(reject, error, response) && response) {
                    resolve(this.getActualResponseFrom(response));
                }
            });
        });

        return promise;
    }

    private handleAnyErrors(reject: Function, error: ServiceError | null, response?: CommitEventsResponse) {
        if (error) {
            this._logger.error('Failed to commit event', error);
            reject(error);
            return false;
        }
        if (response) {
            if (response.hasFailure()) {
                const failure = failures.toSDK(response.getFailure());
                this._logger.error(`Failure with id '${failure.id}' with reason '${failure.reason}'`);
                reject(failure);
                return false;
            }
        }
        return true;
    }

    private getActualResponseFrom(response: CommitEventsResponse): CommittedEvent | CommittedEvents {
        const committedEvents = response.getEventsList().map(event => EventConverters.toSDK(event));
        if (committedEvents.length < 1) {
            throw new MissingEventsFromRuntime();
        }

        if (committedEvents.length > 1) {
            const committedEvents = new CommittedEvents();
            return committedEvents;
        }
        else {
            return committedEvents[0];
        }
    }

    private throwIfEventsArrayAndArtifactsArrayAreNotEqualInLength(inputId: string | Array<string> | Artifact | Array<Artifact> | Guid | Array<ArtifactId> | undefined, input: any) {
        if (inputId && Array.isArray(inputId)) {
            if (input.length !== inputId.length) {
                throw new EventsAndArtifactsAreNotTheSameSize(input.length, inputId.length);
            }
        }
    }

    private throwIfEventAndArtifactTypesAreInconsistentOnSingleOrArray(isEventArray: boolean, isArtifactArray: boolean, input: any, inputId: string | Array<string> | Artifact | Array<Artifact> | Guid | Array<ArtifactId> | undefined) {
        if (isEventArray !== isArtifactArray) {
            throw new InconsistentUseOfArrayForEventsAndArtifacts(input, inputId);
        }
    }
}
