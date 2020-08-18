// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor, Guid } from '@dolittle/rudiments';
import { Artifact, ArtifactId, IArtifacts, ArtifactMap } from '@dolittle/sdk.artifacts';
import { EventHandlerSignature } from './EventHandlerSignature';
import { EventHandlerId } from './EventHandlerId';
import { EventHandler } from './EventHandler';
import { IEventHandler } from './IEventHandler';
import { ScopeId } from '@dolittle/sdk.events';

export type EventHandlerBuilderCallback = (builder: EventHandlerBuilder) => void;

export class EventHandlerBuilder {
    private _handlers: Map<Constructor<any> | Artifact | ArtifactId, EventHandlerSignature<any>> = new Map();
    private _scopeId: ScopeId = Guid.empty;
    private _partitioned = true;

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

    handle<T>(typeOrArtifact: Constructor<T> | Artifact | ArtifactId, method: EventHandlerSignature<T>) {
        this._handlers.set(typeOrArtifact, method);
    }

    build(artifacts: IArtifacts): IEventHandler {
        const artifactsToMethods = new ArtifactMap<EventHandlerSignature<any>>();

        for (const [typeOrArtifact, method] of this._handlers) {
            let artifact: Artifact;
            if (typeOrArtifact instanceof Artifact) {
                artifact = typeOrArtifact;
            } else if (typeOrArtifact instanceof Guid || typeof typeOrArtifact === 'string') {
                artifact = new Artifact(Guid.as(typeOrArtifact));
            } else {
                artifact = artifacts.getFor(typeOrArtifact);
            }

            artifactsToMethods.set(artifact, method);
        }

        return new EventHandler(this._eventHandlerId, this._scopeId, this._partitioned, artifactsToMethods);
    }
}
