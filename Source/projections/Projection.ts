// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EventType, EventTypeMap, ScopeId } from '@dolittle/sdk.events';
import { Constructor } from '@dolittle/types';
import { DeleteReadModelInstance } from './DeleteReadModelInstance';
import { EventSelector } from './EventSelector';
import { IProjection } from './IProjection';
import { KeySelector } from './KeySelector';
import { MissingOnMethodForType } from './MissingOnMethodForType';
import { ProjectionCallback } from './ProjectionCallback';
import { ProjectionContext } from './ProjectionContext';
import { ProjectionId } from './ProjectionId';

/**
 * Represents an implementation of {@link IProjection<T>}.
 * @template T The type of the projection read model.
 */
export class Projection<T> extends IProjection<T> {
    readonly readModelType: Constructor<T> | undefined;
    readonly initialState: T;

    /** @inheritdoc */
    readonly events: Iterable<EventSelector>;

    /**
     * Initializes a new instance of {@link Projection}.
     * @param {ProjectionId} projectionId - The unique identifier for the projection.
     * @param {Constructor<T>|T} readModelTypeOrInstance - The read model type or instance produced by the projection.
     * @param {ScopeId} scopeId - The identifier of the scope the projection is in.
     * @param {EventTypeMap<[ProjectionCallback<any>, KeySelector]>} _eventMap - The events with respective callbacks and keyselectors used by the projection.
     */
    constructor(
        readonly projectionId: ProjectionId,
        readonly readModelTypeOrInstance: Constructor<T> | T,
        readonly scopeId: ScopeId,
        private readonly _eventMap: EventTypeMap<[ProjectionCallback<any>, KeySelector]>
    ) {
        super();

        if (readModelTypeOrInstance instanceof Function) {
            this.readModelType = readModelTypeOrInstance;
            this.initialState = new readModelTypeOrInstance();
        } else {
            this.initialState = readModelTypeOrInstance;
        }

        const eventSelectors: EventSelector[] = [];
        for (const [eventType, [, keySelector]] of this._eventMap.entries()) {
            eventSelectors.push(new EventSelector(eventType, keySelector));
        }
        this.events = eventSelectors;
    }

    /** @inheritdoc */
    async on(readModel: T, event: any, eventType: EventType, context: ProjectionContext): Promise<T | DeleteReadModelInstance> {
        if (this._eventMap.has(eventType)) {
            const [method] = this._eventMap.get(eventType)!;
            return method(readModel, event, context);
        } else {
            throw new MissingOnMethodForType(this.projectionId, eventType);
        }
    }
}
