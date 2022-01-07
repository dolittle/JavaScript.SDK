// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { NestedMap, PrimitiveKey } from './NestedMap';

/**
 * Defines a decomposed key that can be used in a {@link ComplexValueMap}.
 */
export type DecomposedKey = [PrimitiveKey, ...PrimitiveKey[]];

/**
 * Represents a {@link Map} that handles complex value types - that can be decomposed into stable primitive keys - as keys.
 * @template K The type of the complex key.
 * @template V The type of the value.
 * @template D The type of the decomposed primitive values key.
 */
export class ComplexValueMap<K, V, D extends DecomposedKey> implements Map<K, V> {
    private readonly _map: NestedMap<D, [K, V]>;

    /**
     * Initialises a new instance of the {@link ComplexValueMap} class.
     * @param {Constructor} type - The type of the complex value key.
     * @param {(K) => D} _decomposer - The callback to use for decomposing the complex valye key to primitive types.
     * @param {number} depth - The length of a decomposed key.
     */
    constructor(
        type: Constructor<K>,
        private readonly _decomposer: (key: K) => D,
        depth: D['length']
    ) {
        this._map = new NestedMap(depth);
        this[Symbol.toStringTag] = `ComplexValueMap<${type.name}>`;
    }

    /** @inheritdoc */
    [Symbol.toStringTag]: string;

    /** @inheritdoc */
    get size(): number {
        return this._map.size;
    }

    /** @inheritdoc */
    has(key: K): boolean {
        return this._map.has(this._decomposer(key));
    }

    /** @inheritdoc */
    get(key: K): V | undefined {
        return this._map.get(this._decomposer(key))?.[1];
    }

    /** @inheritdoc */
    set(key: K, value: V): this {
        this._map.set(this._decomposer(key), [key, value]);
        return this;
    }

    /** @inheritdoc */
    delete(key: K): boolean {
        return this._map.delete(this._decomposer(key));
    }

    /** @inheritdoc */
    clear(): void {
        this._map.clear();
    }

    /** @inheritdoc */
    *entries(): IterableIterator<[K, V]> {
        for (const [_, [key, value]] of this._map.entries()) {
            yield [key, value];
        }
    }

    /** @inheritdoc */
    [Symbol.iterator](): IterableIterator<[K, V]> {
        return this.entries();
    }

    /** @inheritdoc */
    *keys(): IterableIterator<K> {
        for (const [key, _] of this.entries()) {
            yield key;
        }
    }

    /** @inheritdoc */
    *values(): IterableIterator<V> {
        for (const [_, value] of this.entries()) {
            yield value;
        }
    }

    /** @inheritdoc */
    forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void {
        for (const [key, value] of this.entries()) {
            callbackfn.call(thisArg, value, key, this);
        }
    }
}
