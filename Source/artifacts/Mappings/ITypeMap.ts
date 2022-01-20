// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

/**
 * Defines a system for associating complex valued keys to a type.
 * @template K The type of the key.
 */
export abstract class ITypeMap<K> {
    /**
     * Check if there is a key associated with a given type.
     * @param {Constructor} type - Type to check for.
     * @returns {boolean} True if there is, false if not.
     */
    abstract hasFor(type: Constructor<any>): boolean;

    /**
     * Get the key associated with a given type.
     * @param {Constructor} type - Type to get key for.
     * @returns {K} The key associated with the type.
     */
    abstract getFor(type: Constructor<any>): K;

    /**
     * Gets all the keys that is associated with a type.
     * @returns {K[]} All associated keys type.
     */
    abstract getAll(): K[];

    /**
     * Check if there is a type associated with a given key.
     * @param {K} key - Key to check for.
     * @returns {boolean} True if there is, false if not.
     */
    abstract hasTypeFor(key: K): boolean;

    /**
     * Get the type associated with a given key.
     * @param {K} key - Key to get type for.
     * @returns {Constructor<any>} The type associated with the key.
     */
    abstract getTypeFor(key: K): Constructor<any>;

    /**
     * Gets all the keys that is associated with a type.
     * @returns {Constructor[]} All associated keys type.
     */
    abstract getAllTypes(): Constructor<any>[];

    /**
     * Resolves a key from optional input or the given object.
     * @param {any} object - Object to resolve for.
     * @param {K} [input] - Optional input key.
     * @returns {K} Resolved key.
     */
    abstract resolveFrom(object: any, input?: K): K;

    /**
     * Associate a type with a key.
     * @param {Constructor} type - The type to associate.
     * @param {K} key - The key to associate with.
     */
    abstract associate(type: Constructor<any>, key: K): void;
}
