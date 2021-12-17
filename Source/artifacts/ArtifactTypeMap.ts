// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';
import { Guid } from '@dolittle/rudiments';

import { Artifact } from './Artifact';
import { IdentifierTypeMap } from './IdentifierTypeMap';

/**
 * Represents a map for mapping an artifact to a given type.
 * @template TArtifact The artifact type to map to a type.
 * @template TId The id type of the artifact.
 * @template TType Type to map to.
 */
export class ArtifactTypeMap<TArtifact extends Artifact<TId>, TId extends ConceptAs<Guid, string>, TType> implements Map<TArtifact, TType> {
    private _generationsById: IdentifierTypeMap<TId, Map<number, [TType, TArtifact]>>;

    /**
     * Initialises a new instance of the {@link ArtifactTypeMap} class.
     */
    constructor() {
        this._generationsById = new IdentifierTypeMap<TId, Map<number, [TType, TArtifact]>>();
    }

    /** @inheritdoc */
    get [Symbol.toStringTag]() {
        return 'ArtifactTypeMap';
    }

    /** @inheritdoc */
    get size(): number {
        let size = 0;
        for (const generations of this._generationsById.values()) {
            size += generations.size;
        }
        return size;
    }

    /** @inheritdoc */
    has(key: TArtifact): boolean {
        return this._generationsById.get(key.id)?.has(key.generation.value) ?? false;
    }

    /** @inheritdoc */
    get(key: TArtifact): TType | undefined {
        return this._generationsById.get(key.id)?.get(key.generation.value)?.[0];
    }

    /** @inheritdoc */
    set(key: TArtifact, value: TType): this {
        let generations: Map<number, [TType, TArtifact]>;

        if (this._generationsById.has(key.id)) {
            generations = this._generationsById.get(key.id)!;
        } else {
            generations = new Map<number, [TType, TArtifact]>();
            this._generationsById.set(key.id, generations);
        }

        generations.set(key.generation.value, [value, key]);
        return this;
    }

    /** @inheritdoc */
    clear(): void {
        this._generationsById.clear();
    }

    /** @inheritdoc */
    delete(key: TArtifact): boolean {
        const generations = this._generationsById.get(key.id);
        if (generations) {
            const deleted = generations.delete(key.generation.value);
            if (generations.size === 0) {
                this._generationsById.delete(key.id);
            }
            return deleted;
        }
        return false;
    }

    /** @inheritdoc */
    *[Symbol.iterator](): IterableIterator<[TArtifact, TType]> {
        for (const [_, generations] of this._generationsById) {
            for (const [_, [type, artifact]] of generations) {
                yield [artifact, type];
            }
        }
    }

    /** @inheritdoc */
    entries(): IterableIterator<[TArtifact, TType]> {
        return this[Symbol.iterator]();
    }

    /** @inheritdoc */
    *keys(): IterableIterator<TArtifact> {
        for (const [artifact, _] of this.entries()) {
            yield artifact;
        }
    }

    /** @inheritdoc */
    *values(): IterableIterator<TType> {
        for (const [_, type] of this.entries()) {
            yield type;
        }
    }

    /** @inheritdoc */
    forEach(callbackfn: (value: TType, key: TArtifact, map: Map<TArtifact, TType>) => void, thisArg?: any): void {
        for (const [artifact, type] of this.entries()) {
            callbackfn.call(thisArg, type, artifact, this);
        }
    }
}
