// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { Constructor, Guid } from '@dolittle/rudiments';
import { IExecutionContextManager } from '@dolittle/sdk.execution';
import { Artifact, ArtifactId, IArtifacts, ArtifactMap } from '@dolittle/sdk.artifacts';

import { EventHandlersClient } from '@dolittle/runtime.contracts/Runtime/Events.Processing/EventHandlers_grpc_pb';

import { IEventHandlers } from './IEventHandlers';
import { EventHandlers } from './EventHandlers';
import { EventHandlerSignature } from './EventHandlerMethod';
import { EventHandlerId } from './EventHandlerId';
import { EventHandler } from './EventHandler';
import { IEventHandler } from './IEventHandler';
import { ScopeId } from './ScopeId';

export type EventHandlersBuilderCallback = (builder: EventHandlersBuilder) => void;

/**
 * Represents the builder for configuring event handlers
 */
export class EventHandlersBuilder {
    private _eventHandlers: Map<EventHandlerId, EventHandlerBuilder> = new Map();


    /**
     * Event handler methods
     * @param {...Function[]} types Event handler types
     */
    from(...types: Function[]): void {
        console.log('');
    }

    /**
     * Start building an event handler.
     * @param {EventHandlerId} eventHandlerId The unique identifier of the event handler.
     * @param {EventHandlerBuilderCallback} callback Callback for building out the event handler.
     */
    for(eventHandlerId: EventHandlerId, callback: EventHandlerBuilderCallback ): void {
        const builder = new EventHandlerBuilder(eventHandlerId);
        callback(builder);
        this._eventHandlers.set(eventHandlerId, builder);
    }

    /**
     * Builds an instance for holding event handlers.
     * @returns {IEventHandlers} New instance.
     */
    build(client: EventHandlersClient, executionContextManager: IExecutionContextManager, artifacts: IArtifacts, logger: Logger): IEventHandlers {
        const eventHandlers = new EventHandlers(client, executionContextManager, artifacts, logger);

        for ( const [eventHandlerId, eventHandlerBuilder] of this._eventHandlers ) {
            const eventHandler = eventHandlerBuilder.build(artifacts);
            eventHandlers.register(eventHandlerId, eventHandlerBuilder.scopeId, eventHandlerBuilder.isPartitioned, eventHandler);
        }

        return eventHandlers;
    }
}



export type EventHandlerBuilderCallback = (builder: EventHandlerBuilder) => void;



export class EventHandlerBuilder {
    private _handlers: Map<Constructor<any> | Artifact | ArtifactId, EventHandlerSignature> = new Map();

    private _scopeId: ScopeId = Guid.empty;
    private _partitioned: boolean = true;

    constructor(private _eventHandlerId: EventHandlerId) {
    }

    get scopeId(): ScopeId {
        return this._scopeId;
    }

    get isPartitioned(): boolean {
        return this._partitioned;
    }

    partitioned() {
        this._partitioned = true;
    }

    unpartitioned() {
        this._partitioned = false;
    }

    inScope(scopeId: ScopeId) {
        this._scopeId = scopeId;
    }

    handle(typeOrArtifact: Constructor<any> | Artifact | ArtifactId, method: EventHandlerSignature) {
        this._handlers.set(typeOrArtifact, method);
    }

    build(artifacts: IArtifacts): IEventHandler {
        const artifactsToMethods = new ArtifactMap<EventHandlerSignature>();

        for ( const [typeOrArtifact, method] of this._handlers ) {
            let artifact: Artifact;
            if ( typeOrArtifact instanceof Artifact ) {
                artifact = typeOrArtifact;
            } else if (typeOrArtifact instanceof Guid || typeof typeOrArtifact === 'string') {
                artifact = new Artifact(Guid.as(typeOrArtifact));
            } else {
                artifact = artifacts.getFor(typeOrArtifact);
            }

            artifactsToMethods.set(artifact, method);
        }

        return new EventHandler(this._eventHandlerId, artifactsToMethods);
    }
}
