// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ArtifactId, Artifact, IArtifacts } from '@dolittle/sdk.artifacts';
import { IExecutionContextManager } from '@dolittle/sdk.execution';

import { IEventStore } from './IEventStore';
import { CommittedEvent } from './CommittedEvent';
import { CommittedEvents } from './CommittedEvents';
import { EventSourceId } from './EventSourceId';
import { UnknownEventType } from './UnknownEventType';
import { EventsAndArtifactsAreNotTheSameSize } from './EventsAndArtifactsAreNotTheSameSize';

import { EventStoreClient } from '@dolittle/runtime.contracts/Runtime/Events/EventStore_grpc_pb';
import { CallRequestContext } from '@dolittle/runtime.contracts/Fundamentals/Services/CallContext_pb';
import { ExecutionContext as GrpcExecutionContext } from '@dolittle/runtime.contracts/Fundamentals/Execution/ExecutionContext_pb';
import { UncommittedEvent } from '@dolittle/runtime.contracts/Runtime/Events/Uncommitted_pb';
import { CommitEventsRequest } from '@dolittle/runtime.contracts/Runtime/Events/EventStore_pb';

import '@dolittle/sdk.protobuf';

export class EventStore implements IEventStore {
    constructor(private _eventStoreClient: EventStoreClient, private _artifacts: IArtifacts, private _executionContextManager: IExecutionContextManager) {
    }

    async commit(event: any, eventSourceId: EventSourceId, artifactId?: Artifact | ArtifactId): Promise<CommittedEvent>;
    async commit(events: any[], eventSourceId: EventSourceId, artifactIds?: Artifact[] | ArtifactId[]): Promise<CommittedEvents>;
    async commit(input: any | any[], eventSourceId: EventSourceId, inputId?: Artifact | Artifact[] | ArtifactId | ArtifactId[]): Promise<CommittedEvent | CommittedEvents> {
        const uncommittedEvents: UncommittedEvent[] = [];
        const array = Array.isArray(input);

        if (array) {

            if (inputId && Array.isArray(inputId)) {
                if (input.length !== inputId.length) {
                    throw new EventsAndArtifactsAreNotTheSameSize(input.length, inputId.length);
                }
            }

            input.forEach((event: any, index: number) => {
                let artifact: Artifact | undefined;

                if (inputId && Array.isArray(inputId)) {
                    const artifactOrId = inputId[index];
                    if (artifactOrId instanceof Artifact) {
                        artifact = artifact;
                    }
                }

                if (!artifact) {
                    if (this._artifacts.hasFor(event)) {
                        artifact = this._artifacts.getFor(event.constructor);
                    }
                }

                if (!artifact) {
                    throw new UnknownEventType(input.constructor);
                }
            });

        } else {
            let artifact: Artifact | undefined;

            if (inputId && inputId instanceof Artifact) {
                artifact = inputId as Artifact;
            } else {
                if (!inputId) {
                    if (this._artifacts.hasFor(input.constructor)) {
                        artifact = this._artifacts.getFor(input.constructor);
                    }
                }
            }

            if (!artifact) {
                throw new UnknownEventType(input.constructor);
            }

            uncommittedEvents.push(this.getUncommittedEventFrom(input, eventSourceId, artifact, false));
        }

        const request = new CommitEventsRequest();
        request.setCallcontext(this.getCallContext());
        request.setEventsList(uncommittedEvents);

        const promise: Promise<any> = new Promise((resolve, reject) => {
            this._eventStoreClient.commit(request, response => {
                if (array) {
                    const committedEvents = new CommittedEvents();
                    resolve(committedEvents);
                } else {
                    const committedEvent = new CommittedEvent();
                    resolve(committedEvent);
                }
            });
        });

        return promise;
    }


    commitPublic(event: any, eventSourceId: EventSourceId, artifactId?: Artifact | ArtifactId): Promise<CommittedEvent>;
    commitPublic(events: any[], eventSourceId: EventSourceId, artifactIds?: Artifact[] | ArtifactId[]): Promise<CommittedEvents>;
    commitPublic(input: any | any[], eventSourceId: EventSourceId, inputId?: Artifact | Artifact[] | ArtifactId | ArtifactId[]): Promise<CommittedEvent | CommittedEvents> {
        throw new Error('Method not implemented.');
    }


    private getUncommittedEventFrom(event: any, eventSourceId: EventSourceId, artifact: Artifact, isPublic: boolean) {
        const uncommittedEvent = new UncommittedEvent();
        uncommittedEvent.setArtifact(artifact.toProtobuf());
        uncommittedEvent.setEventsourceid(eventSourceId.toProtobuf());
        uncommittedEvent.setPublic(isPublic);
        uncommittedEvent.setContent(JSON.stringify(event));
        return uncommittedEvent;
    }

    private getCallContext() {
        const executionContext = this._executionContextManager.current;
        const callContext = new CallRequestContext();
        const grpcExecutionContext = new GrpcExecutionContext();
        grpcExecutionContext.setMicroserviceid(executionContext.microserviceId.toProtobuf());
        grpcExecutionContext.setTenantid(executionContext.tenantId.toProtobuf());
        grpcExecutionContext.setVersion(executionContext.version.toProtobuf());
        grpcExecutionContext.setCorrelationid(executionContext.correlationId.toProtobuf());
        grpcExecutionContext.setClaimsList(executionContext.claims.toProtobuf());
        return callContext;
    }
}
