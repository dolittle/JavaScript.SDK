// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import { Artifact, ArtifactMap } from '@dolittle/sdk.artifacts';
import { EventContext, ScopeId } from '@dolittle/sdk.events';

import { EventHandlerDecoratedTypes, IEventHandler, EventHandlerSignature, MissingEventHandlerForType, EventHandlerId } from './index';

/**
 * Represents an implementation of {@link IEventHandler}.
 */
export class EventHandler implements IEventHandler {

    /**
     * Initializes a new instance of {@link EventHandler}
     * @param {EventHandlerId} eventHandlerId The unique identifier of the event handler.
     * @param {ScopeId} scopeId The identifier of the scope the event handler is in.
     * @param {boolean} partitioned Whether or not the event handler is partitioned.
     * @param {ArtifactMap<EventHandlerSignature<any>>} handleMethodsByArtifact Handle methods per artifact type.
     */
    constructor(
        readonly eventHandlerId: EventHandlerId,
        readonly scopeId: ScopeId,
        readonly partitioned: boolean,
        readonly handleMethodsByArtifact: ArtifactMap<EventHandlerSignature<any>>) {
    }

    /** @inheritdoc */
    get handledEvents(): Iterable<Artifact> {
        return this.handleMethodsByArtifact.keys();
    }

    /** @inheritdoc */
    async handle(event: any, artifact: Artifact, context: EventContext): Promise<void> {
        if (this.handleMethodsByArtifact.has(artifact)) {
            const method = this.handleMethodsByArtifact.get(artifact)!;
            await method(event, context);
        } else {
            throw new MissingEventHandlerForType(artifact);
        }
    }
}

export function eventHandler(eventHandlerId: Guid | string) {
    return function (target: any) {
        EventHandlerDecoratedTypes.registerEventHandler(
            EventHandlerId.from(eventHandlerId),
            target);
    };
}
export function inScope(scopeId: Guid | string) {
    return function (target: any) {
        EventHandlerDecoratedTypes.registerScope(
            ScopeId.from(scopeId),
            target);
    };
}
export function unpartitioned() {
    return function (target: any) {
        EventHandlerDecoratedTypes.registerUnpartitioned(
            target);
    };
}