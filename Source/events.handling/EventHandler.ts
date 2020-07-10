// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Artifact, ArtifactMap } from '@dolittle/sdk.artifacts';
import { EventContext } from '@dolittle/sdk.events';

import { EventHandlerDecoratedTypes } from './EventHandlerDecoratedTypes';
import { EventHandlerId } from './EventHandlerId';
import { EventHandlerSignature } from './EventHandlerMethod';
import { IEventHandler } from './IEventHandler';

export class EventHandler implements IEventHandler {
    constructor(readonly eventHandlerId: EventHandlerId, readonly handleMethodsByArtifact: ArtifactMap<EventHandlerSignature>) {
    }

    get handledEvents(): Iterable<Artifact> {
        return this.handleMethodsByArtifact.keys();
    }

    handle(event: any, artifact: Artifact, context: EventContext): void {
        debugger;
        if (this.handleMethodsByArtifact.has(artifact)) {
            const method = this.handleMethodsByArtifact.get(artifact)!;
            method(event, context);
        } else {
            throw new MissingEventHandlerForType(artifact);
        }
    }
}

export function eventHandler(eventHandlerId: EventHandlerId) {
    return function (target: any) {
        EventHandlerDecoratedTypes.register(eventHandlerId, target.constructor);
    };
}


export class MissingEventHandlerForType extends Error {
    constructor(artifact: Artifact) {
        super(`Missing event handler for '${artifact}'`);
    }
 }
