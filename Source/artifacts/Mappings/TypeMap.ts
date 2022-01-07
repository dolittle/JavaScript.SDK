// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';
import { CannotHaveMultipleKeysAssociatedWithType } from './CannotHaveMultipleKeysAssociatedWithType';
import { CannotHaveMultipleTypesAssociatedWithKey } from './CannotHaveMultipleTypesAssociatedWithKey';

import { ComplexValueMap, DecomposedKey } from './ComplexMap';
import { KeyNotAssociatedWithType } from './KeyNotAssociatedWithType';
import { TypeNotAssociatedWithKey } from './TypeNotAssociatedWithKey';
import { UnableToResolveKey } from './UnableToResolveKey';

/**
 * Represents a system for associating complex valued keys to a type.
 * @template K The type of the key.
 * @template D The type of the decomposed complex key type.
 */
export class TypeMap<K, D extends DecomposedKey> {
    private readonly _keysToTypes: ComplexValueMap<K, Constructor<any>, D>;
    private readonly _typesToKeys: Map<Constructor<any>, K>;

    /**
     * Initialises a new instance of the {@link TypeMap} class.
     * @param {Constructor} _keyType - The type of the complex valued key.
     * @param {(K) => D} decomposer - The callback to use for decomposing the complex valye key to primitive types.
     * @param {number} depth - The length of a decomposed key.
     */
    constructor(
        private readonly _keyType: Constructor<K>,
        decomposer: (key: K) => D,
        depth: D['length']
    ) {
        this._keysToTypes = new ComplexValueMap(_keyType, decomposer, depth);
        this._typesToKeys = new Map();
    }

    /**
     * Check if there is a key associated with a given type.
     * @param {Constructor} type - Type to check for.
     * @returns {boolean} True if there is, false if not.
     */
    hasFor(type: Constructor<any>): boolean {
        return this._typesToKeys.has(type);
    }

    /**
     * Get the key associated with a given type.
     * @param {Constructor} type - Type to get key for.
     * @returns {K} The key associated with the type.
     */
    getFor(type: Constructor<any>): K {
        if (this.hasFor(type)) {
            throw new TypeNotAssociatedWithKey(type, this._keyType);
        }
        return this._typesToKeys.get(type)!;
    }

    /**
     * Gets all the keys that is associated with a type.
     * @returns {K[]} All associated keys type.
     */
    getAll(): K[] {
        return Array.from(this._typesToKeys.values());
    }

    /**
     * Check if there is a type associated with a given key.
     * @param {K} key - Key to check for.
     * @returns {boolean} True if there is, false if not.
     */
    hasTypeFor(key: K): boolean {
        return this._keysToTypes.has(key);
    }

    /**
     * Get the type associated with a given key.
     * @param {K} key - Key to get type for.
     * @returns {Constructor<any>} The type associated with the key.
     */
    getTypeFor(key: K): Constructor<any> {
        if (this.hasTypeFor(key)) {
            throw new KeyNotAssociatedWithType(key);
        }
        return this._keysToTypes.get(key)!;
    }

    /**
     * Gets all the keys that is associated with a type.
     * @returns {Constructor[]} All associated keys type.
     */
    getAllTypes(): Constructor<any>[] {
        return Array.from(this._typesToKeys.keys());
    }

    /**
     * Resolves a key from optional input or the given object.
     * @param {any} object - Object to resolve for.
     * @param {K} [input] - Optional input key.
     * @returns {K} Resolved key.
     */
    resolveFrom(object: any, input?: K): K {
        if (input !== undefined) {
            return input;
        }

        const type = Object.getPrototypeOf(object).constructor;
        if (this.hasFor(type)) {
            return this.getFor(type);
        }

        throw new UnableToResolveKey(object, this._keyType);
    }

    /**
     * Associate a type with a key.
     * @param {Constructor} type - The type to associate.
     * @param {K} key - The key to associate with.
     */
    associate(type: Constructor<any>, key: K): void {
        this.throwIfTypeAlreadyAssociatedWithKey(type, key);
        this.throwIfKeyAlreadyAssociatedWithType(key, type);

        this._typesToKeys.set(type, key);
        this._keysToTypes.set(key, type);
    }

    private throwIfTypeAlreadyAssociatedWithKey(type: Constructor<any>, key: K) {
        if (this.hasFor(type)) {
            throw new CannotHaveMultipleKeysAssociatedWithType(type, key, this.getFor(type), this._keyType);
        }
    }

    private throwIfKeyAlreadyAssociatedWithType(key: K, type: Constructor<any>) {
        if (this.hasTypeFor(key)) {
            throw new CannotHaveMultipleTypesAssociatedWithKey(key, type, this.getTypeFor(key), this._keyType);
        }
    }
}
