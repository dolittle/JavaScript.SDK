// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EventContext, EventType, EventTypeMap, ScopeId } from '@dolittle/sdk.events';
import { Constructor } from '@dolittle/types';
import { IProjection } from './IProjection';
import { KeySelector } from './KeySelector';
import { MissingProjectionForType } from './MissingProjectionForType';
import { ProjectionId } from './ProjectionId';
import { ProjectionCallback } from './ProjectionCallback';
import { ProjectionContext } from './ProjectionContext';
import { EventSelector } from './EventSelector';

export class Projection<T> implements IProjection<T> {

    /** @inheritdoc */
    readonly events: Iterable<EventSelector>;

    /**
     * Initializes a new instance of {@link Projection}
     * @param {ProjectionId} projectionId The unique identifier for the projection.
     * @param {Constructor<T>|T} readModelTypeOrInstance The read model type or instance produced by the projection.
     * @param {ScopId} scopeId The identifier of the scope the projection is in.
     * @param {EventTypeMap<[ProjectionCallback<any>, KeySelector]>} events The events with respective callbacks and keyselectors used by the projection.
     */
    constructor(
        readonly projectionId: ProjectionId,
        readonly readModelTypeOrInstance: Constructor<T> | T,
        readonly scopeId: ScopeId,
        private readonly _eventMap: EventTypeMap<[ProjectionCallback<any>, KeySelector]>) {
        const eventSelectors: EventSelector[] = [];
        for (const [eventType, [, keySelector]] of this._eventMap.entries()) {
            eventSelectors.push(new EventSelector(eventType, keySelector));
        }
        this.events = eventSelectors;
    }

    /** @inheritdoc */
    async on(readModel: T, event: any, eventType: EventType, context: ProjectionContext): Promise<void> {
        if (this._eventMap.has(eventType)) {
            const [method] = this._eventMap.get(eventType)!;
            await method(readModel, event, context);
        } else {
            throw new MissingProjectionForType(eventType);
        }
    }
}
