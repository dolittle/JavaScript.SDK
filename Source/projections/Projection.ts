// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EventType, EventTypeMap, ScopeId } from '@dolittle/sdk.events';
import { Constructor } from '@dolittle/types';

import { ProjectionCopies } from './Copies/ProjectionCopies';
import { DeleteReadModelInstance } from './DeleteReadModelInstance';
import { EventSelector } from './EventSelector';
import { IProjection } from './IProjection';
import { KeySelector } from './KeySelector';
import { MissingOnMethodForType } from './MissingOnMethodForType';
import { ProjectionCallback } from './ProjectionCallback';
import { ProjectionContext } from './ProjectionContext';
import { ProjectionId } from './ProjectionId';
import { ProjectionAlias } from './ProjectionAlias';

/**
 * Represents an implementation of {@link IProjection<T>}.
 * @template T The type of the projection read model.
 */
export class Projection<T> extends IProjection<T> {
    /** @inheritdoc */
    readonly readModelType: Constructor<T> | undefined;

    /** @inheritdoc */
    readonly initialState: T;

    /** @inheritdoc */
    readonly events: Iterable<EventSelector>;

    /** @inheritdoc */
    readonly hasAlias: boolean;

    /**
     * Initializes a new instance of {@link Projection}.
     * @param {ProjectionId} projectionId - The unique identifier for the projection.
     * @param {Constructor<T>|T} readModelTypeOrInstance - The read model type or instance produced by the projection.
     * @param {ScopeId} scopeId - The identifier of the scope the projection is in.
     * @param {EventTypeMap<[ProjectionCallback<any>, KeySelector]>} _eventMap - The events with respective callbacks and keyselectors used by the projection.
     * @param {ProjectionCopies} copies - The read model copies specification for the projection.
     * @param {ProjectionAlias | undefined} alias - The optional projection alias.
     */
    constructor(
        readonly projectionId: ProjectionId,
        readonly readModelTypeOrInstance: Constructor<T> | T,
        readonly scopeId: ScopeId,
        private readonly _eventMap: EventTypeMap<[ProjectionCallback<any>, KeySelector]>,
        readonly copies: ProjectionCopies,
        readonly alias: ProjectionAlias | undefined = undefined
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

        this.hasAlias = alias !== undefined;
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
