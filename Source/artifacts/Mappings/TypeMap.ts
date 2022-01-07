// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';
import { CannotHaveMultipleKeysAssociatedWithType } from './CannotHaveMultipleKeysAssociatedWithType';
import { CannotHaveMultipleTypesAssociatedWithKey } from './CannotHaveMultipleTypesAssociatedWithKey';

import { ComplexValueMap, DecomposedKey } from './ComplexMap';
import { ITypeMap } from './ITypeMap';
import { KeyNotAssociatedWithType } from './KeyNotAssociatedWithType';
import { TypeNotAssociatedWithKey } from './TypeNotAssociatedWithKey';
import { UnableToResolveKey } from './UnableToResolveKey';

/**
 * Represents a system for associating complex valued keys to a type.
 * @template K The type of the key.
 * @template D The type of the decomposed complex key type.
 */
export class TypeMap<K, D extends DecomposedKey> extends ITypeMap<K> {
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
        super();
        this._keysToTypes = new ComplexValueMap(_keyType, decomposer, depth);
        this._typesToKeys = new Map();
    }

    /** @inheritdoc */
    hasFor(type: Constructor<any>): boolean {
        return this._typesToKeys.has(type);
    }

    /** @inheritdoc */
    getFor(type: Constructor<any>): K {
        if (!this.hasFor(type)) {
            throw new TypeNotAssociatedWithKey(type, this._keyType);
        }
        return this._typesToKeys.get(type)!;
    }

    /** @inheritdoc */
    getAll(): K[] {
        return Array.from(this._typesToKeys.values());
    }

    /** @inheritdoc */
    hasTypeFor(key: K): boolean {
        return this._keysToTypes.has(key);
    }

    /** @inheritdoc */
    getTypeFor(key: K): Constructor<any> {
        if (!this.hasTypeFor(key)) {
            throw new KeyNotAssociatedWithType(key);
        }
        return this._keysToTypes.get(key)!;
    }

    /** @inheritdoc */
    getAllTypes(): Constructor<any>[] {
        return Array.from(this._typesToKeys.keys());
    }

    /** @inheritdoc */
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

    /** @inheritdoc */
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
