// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { GenerationLike } from '@dolittle/sdk.artifacts';

import { EventType, EventTypeAliasLike, EventTypeIdLike } from '..';

/**
 * Represents a builder for associating types with an {@link EventType}.
 */
export abstract class IEventTypesBuilder {
    /**
     * Associate a type with an unique event type identifier and optional generation.
     * @param {Constructor} type - Type to associate.
     * @param {EventType} eventType - EventType to associate with.
     * @returns {IEventTypesBuilder} The builder for continuation.
     */
    abstract associate<T = any>(type: Constructor<T>, eventType: EventType): IEventTypesBuilder;

    /**
     * Associate a type with an unique event type identifier and optional generation.
     * @param {Constructor} type - Type to associate.
     * @param {EventTypeIdLike} identifier - Identifier to associate with.
     * @param {EventTypeAliasLike} [alias] - Optional alias to associate with the event type.
     * @returns {IEventTypesBuilder} The builder for continuation.
     */
    abstract associate<T = any>(type: Constructor<T>, identifier: EventTypeIdLike, alias?: EventTypeAliasLike): IEventTypesBuilder;

    /**
     * Associate a type with an unique event type identifier and optional generation.
     * @param {Constructor} type - Type to associate.
     * @param {EventTypeIdLike} identifier - Identifier to associate with.
     * @param {GenerationLike} generation - The generation to associate with.
     * @param {EventTypeAliasLike} [alias] - Optional alias to associate with the event type.
     * @returns {IEventTypesBuilder} The builder for continuation.
     */
    abstract associate<T = any>(type: Constructor<T>, identifier: EventTypeIdLike, generation: GenerationLike, alias?: EventTypeAliasLike): IEventTypesBuilder;

    /**
     * Register a decorated type as an {@link EventType}.
     * @param {Constructor<T>} type - The type to register as an {@link EventType}.
     * @returns {IEventTypesBuilder} The builder for continuation.
     * @template T The type of the event to register.
     */
    abstract register<T = any>(type: Constructor<T>): IEventTypesBuilder;
}
