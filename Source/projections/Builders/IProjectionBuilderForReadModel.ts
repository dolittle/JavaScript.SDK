// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { Generation } from '@dolittle/sdk.artifacts';
import { EventType, EventTypeIdLike, ScopeId } from '@dolittle/sdk.events';

import { ProjectionCallback } from '../ProjectionCallback';
import { KeySelectorBuilderCallback } from './KeySelectorBuilderCallback';

/**
 * Defines a builder for building a projection for a read model from method callbacks.
 * @template T The type of the projection read model.
 */
export abstract class IProjectionBuilderForReadModel<T> {
    /**
     * Add an on method for handling the event.
     * @template TEvent Type of event.
     * @param {Constructor<TEvent>} type - The type of event.
     * @param {KeySelectorBuilderCallback<TEvent>} keySelectorCallback - Callback for building key selector.
     * @param {ProjectionCallback<T, TEvent>} callback - Callback to call for each event.
     * @returns {IProjectionBuilderForReadModel<T>} The builder for continuation.
     */
    abstract on<TEvent>(type: Constructor<TEvent>, keySelectorCallback: KeySelectorBuilderCallback<TEvent>, callback: ProjectionCallback<T, TEvent>): IProjectionBuilderForReadModel<T>;

    /**
     * Add an on method for handling the event.
     * @param {EventType} eventType - The identifier of the event.
     * @param {KeySelectorBuilderCallback} keySelectorCallback - Callback for building key selector.
     * @param {ProjectionCallback<T>} callback - Callback to call for each event.
     * @returns {IProjectionBuilderForReadModel<T>} The builder for continuation.
     */
     abstract on(eventType: EventType, keySelectorCallback: KeySelectorBuilderCallback, callback: ProjectionCallback<T>): IProjectionBuilderForReadModel<T>;

    /**
     * Add an on method for handling the event.
     * @param {EventTypeIdLike} eventType - The identifier of the event.
     * @param {KeySelectorBuilderCallback<T>} keySelectorCallback - Callback for building key selector.
     * @param {ProjectionCallback<T>} callback - Callback to call for each event.
     * @returns {IProjectionBuilderForReadModel<T>} The builder for continuation.
     */
     abstract on(eventTypeId: EventTypeIdLike, keySelectorCallback: KeySelectorBuilderCallback, callback: ProjectionCallback<T>): IProjectionBuilderForReadModel<T>;

    /**
     * Add an on method for handling the event.
     * @param {EventTypeIdLike} eventType - The identifier of the event.
     * @param {Generation | number} generation - The generation of the event type.
     * @param {KeySelectorBuilderCallback<T>} keySelectorCallback - Callback for building key selector.
     * @param {ProjectionCallback<T>} method - Callback to call for each event.
     * @returns {IProjectionBuilderForReadModel<T>} The builder for continuation.
     */
     abstract on(eventTypeId: EventTypeIdLike, generation: Generation | number, keySelectorCallback: KeySelectorBuilderCallback, callback: ProjectionCallback<T>): IProjectionBuilderForReadModel<T>;

    /**
     * Defines the projection to operate in a specific {@link ScopeId}.
     * @param {ScopeId | Guid | string} scopeId - Scope the projection operates in.
     * @returns {IProjectionBuilderForReadModel<T>} The builder for continuation.
     */
    abstract inScope(scopeId: ScopeId | Guid | string): IProjectionBuilderForReadModel<T>;
}
