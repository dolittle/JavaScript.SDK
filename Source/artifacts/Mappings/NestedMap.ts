// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { CannotAccessMapsOfNestedMapWithNoMoreLevels } from './CannotAccessMapsOfNestedMapWithNoMoreLevels';
import { CannotAccessValuesOfNestedMapWithMoreLevels } from './CannotAccessValuesOfNestedMapWithMoreLevels';
import { IncorrectNumberOfPrimitiveKeysProvided } from './IncorrectNumberOfPrimitiveKeysProvided';

/**
 * Defines a primitive key that can be used in a {@link NestedMap}.
 */
export type PrimitiveKey = number | bigint | string | boolean;

/**
 * Represents a {@link Map} that handles a set of primitive keys in a recursive structure.
 */
export class NestedMap<K extends PrimitiveKey[], V> implements Map<K, V> {
    private readonly _map: Map<K[0], NestedMap<PrimitiveKey[], V> | V> = new Map();

    /**
     * Initialises a new instance of the {@link NestedMap} class.
     * @param {number} depth - The number of keys from this map and down.
     */
    constructor(readonly depth: K['length']) {
    }

    /** @inheritdoc */
    [Symbol.toStringTag] = 'NestedMap';

    /** @inheritdoc */
    get size(): number {
        if (this.depth === 1) {
            return this._map.size;
        }

        let size = 0;
        for (const subMap of this._maps.values()) {
            size += subMap.size;
        }
        return size;
    }

    /** @inheritdoc */
    has(key: K): boolean {
        this.throwIfIncorrectNumberOfPrimitiveKeysProvided(key);

        const [first, ...rest] = key;
        if (!this._map.has(first)) return false;

        if (this.depth === 1) {
            return true;
        } else {
            return this._maps.get(first)!.has(rest);
        }
    }

    /** @inheritdoc */
    get(key: K): V | undefined {
        this.throwIfIncorrectNumberOfPrimitiveKeysProvided(key);

        const [first, ...rest] = key;

        if (this.depth === 1) {
            return this._values.get(first);
        } else {
            return this._maps.get(first)?.get(rest);
        }
    }

    /** @inheritdoc */
    set(key: K, value: V): this {
        this.throwIfIncorrectNumberOfPrimitiveKeysProvided(key);

        const [first, ...rest] = key;

        if (this.depth === 1) {
            this._values.set(first, value);
        } else {
            let map = this._maps.get(first);
            if (map === undefined) {
                map = new NestedMap<PrimitiveKey[], V>(this.depth - 1);
                this._maps.set(first, map);
            }
            map.set(rest, value);
        }
        return this;
    }

    /** @inheritdoc */
    delete(key: K): boolean {
        this.throwIfIncorrectNumberOfPrimitiveKeysProvided(key);

        const [first, ...rest] = key;

        if (this.depth === 1) {
            return this._values.delete(first);
        } else {
            if (!this._maps.has(first)) {
                return false;
            }

            const map = this._maps.get(first)!;
            const deleted = map.delete(rest);
            if (deleted && map.internalMapSize === 0) {
                this._map.delete(first);
            }
            return deleted;
        }
    }

    /** @inheritdoc */
    clear(): void {
        this._map.clear();
    }

    /** @inheritdoc */
    *entries(): IterableIterator<[K, V]> {
        for (const [first, entry] of this._map.entries()) {
            if (this.depth === 1) {
                yield [[first] as K, entry as V];
            } else {
                for (const [rest, value] of entry as NestedMap<PrimitiveKey[], V>) {
                    yield [[first, ...rest] as K, value];
                }
            }
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

    /**
     * Gets the actual size of the internal map without recursing down into nested maps.
     */
    protected get internalMapSize(): number {
        return this._map.size;
    }

    private throwIfIncorrectNumberOfPrimitiveKeysProvided(keys: K) {
        if (keys.length !== this.depth) {
            throw new IncorrectNumberOfPrimitiveKeysProvided(keys.length, this.depth);
        }
    }

    private get _maps(): Map<K[0], NestedMap<PrimitiveKey[], V>> {
        if (this.depth === 1) {
            throw new CannotAccessMapsOfNestedMapWithNoMoreLevels();
        }
        return this._map as Map<K[0], NestedMap<PrimitiveKey[], V>>;
    }

    private get _values(): Map<K[0], V> {
        if (this.depth !== 1) {
            throw new CannotAccessValuesOfNestedMapWithMoreLevels(this.depth);
        }
        return this._map as Map<K[0], V>;
    }
}
