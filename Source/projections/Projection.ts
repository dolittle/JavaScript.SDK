// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EventContext, EventType, EventTypeMap, ScopeId } from '@dolittle/sdk.events';
import { Constructor } from '@dolittle/types';
import { IProjection } from './IProjection';
import { MissingProjectionForType } from './MissingProjectionForType';
import { ProjectionId } from './ProjectionId';
import { ProjectionSignature } from './ProjectionSignature';

export class Projection implements IProjection {

    /**
     * Initializes a new instance of {@link Projection}
     * @param {ProjectionId} projectionId The unique identifier for the projection.
     * @param {ScopId} scopeId The identifier of the scope the projection is in.
     * @param {EventTypeMap<EventHandlerSignature<any>>} onMethodsByEventType Handle methods per event type.
     */
    constructor(
        readonly projectionId: ProjectionId,
        readonly readModel: Constructor<any>,
        readonly scopeId: ScopeId,
        readonly onMethodsByEventType: EventTypeMap<ProjectionSignature<any>>) { }

    /** @inheritdoc */
    get handledEvents(): Iterable<EventType> {
        return this.onMethodsByEventType.keys();
    }

    /** @inheritdoc */
    async on(readModel: any, event: any, eventType: EventType, context: EventContext): Promise<void> {
        if (this.onMethodsByEventType.has(eventType)) {
            const method = this.onMethodsByEventType.get(eventType)!;
            await method(readModel, event, context);
        } else {
            throw new MissingProjectionForType(eventType);
        }
    }
}
