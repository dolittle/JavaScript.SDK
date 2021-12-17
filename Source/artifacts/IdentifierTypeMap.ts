// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';
import { Guid } from '@dolittle/rudiments';

/**
 * Represents a map for mapping an identifier to a given type.
 */
export class IdentifierTypeMap<TId extends ConceptAs<Guid, string>, TType> implements Map<TId, TType> {
    private readonly _typesById: Map<string, [TType, TId]>;

    /**
     * Initialises a new instance of the {@link IdentifierTypeMap} class.
     */
    constructor() {
        this._typesById = new Map<string, [TType, TId]>();
    }

    /** @inheritdoc */
    get [Symbol.toStringTag]() {
        return 'IdentifierTypeMap';
    }

    /** @inheritdoc */
    get size(): number {
        return this._typesById.size;
    }

    /** @inheritdoc */
    has(key: TId): boolean {
        const id = key.value.toString();
        return this._typesById.has(id);
    }

    /** @inheritdoc */
    get(key: TId): TType | undefined {
        const id = key.value.toString();
        return this._typesById.get(id)?.[0];
    }

    /** @inheritdoc */
    set(key: TId, value: TType): this {
        const id = key.value.toString();
        this._typesById.set(id, [value, key]);
        return this;
    }

    /** @inheritdoc */
    clear(): void {
        this._typesById.clear();
    }

    /** @inheritdoc */
    delete(key: TId): boolean {
        const id = key.value.toString();
        return this._typesById.delete(id);
    }

    /** @inheritdoc */
    *[Symbol.iterator](): IterableIterator<[TId, TType]> {
        for (const [type, id] of this._typesById.values()) {
            yield [id, type];
        }
    }

    /** @inheritdoc */
    entries(): IterableIterator<[TId, TType]> {
        return this[Symbol.iterator]();
    }

    /** @inheritdoc */
    *keys(): IterableIterator<TId> {
        for (const [id, _] of this.entries()) {
            yield id;
        }
    }

    /** @inheritdoc */
    *values(): IterableIterator<TType> {
        for (const [_, type] of this.entries()) {
            yield type;
        }
    }

    /** @inheritdoc */
    forEach(callbackfn: (value: TType, key: TId, map: Map<TId, TType>) => void, thisArg?: any): void {
        for (const [id, type] of this.entries()) {
            callbackfn.call(thisArg, type, id, this);
        }
    }
}
