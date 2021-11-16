// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Artifact, ArtifactIdLike } from './Artifact';
import { Generation } from './Generation';

/**
 * Represents a map for mapping an artifact to a given type and provide.
 * @template TArtifact The artifact type to map to a type.
 * @template TId The id type of the artifact.
 * @template TType Type to map to.
 */
export abstract class ArtifactTypeMap<TArtifact extends Artifact<TId>, TId extends ArtifactIdLike, TType> implements Map<TArtifact, TType> {
    private _generationsById: Map<string, Map<number, [TType, TArtifact]>>;

    /**
     * Initializes a new instance of {@link EventTypeMap}
     */
    constructor() {
        this._generationsById = new Map<string, Map<number, [TType, TArtifact]>>();
    }
    /** @inheritdoc */
    abstract [Symbol.toStringTag]: string;

    /**
     * Gets the size of the map.
     */
    get size(): number {
        let size = 0;
        for (const generations of this._generationsById.values()) {
            size += generations.size;
        }
        return size;
    }

    /** @inheritdoc */
    has(key: TArtifact): boolean {
        const artifactId = key.id.toString();
        return this._generationsById.get(artifactId)?.has(key.generation.value) ?? false;
    }

    /** @inheritdoc */
    get(key: TArtifact): TType | undefined {
        const artifactId = key.id.toString();
        return this._generationsById.get(artifactId)?.get(key.generation.value)?.[0];
    }

    /** @inheritdoc */
    set(key: TArtifact, value: TType): this {
        const artifactId = key.id.toString();

        let generations: Map<number, [TType, TArtifact]>;
        if (this._generationsById.has(artifactId)) {
            generations = this._generationsById.get(artifactId)!;
        } else {
            generations = new Map<number, [TType, TArtifact]>();
            this._generationsById.set(artifactId, generations);
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
        const artifactId = key.id.toString();

        const generations = this._generationsById.get(artifactId);
        if (generations) {
            const deleted = generations.delete(key.generation.value);
            if (generations.size === 0) {
                this._generationsById.delete(artifactId);
            }
            return deleted;
        }
        return false;
    }

    /** @inheritdoc */
    *[Symbol.iterator](): IterableIterator<[TArtifact, TType]> {
        for (const [artifactId, generations] of this._generationsById) {
            for (const [generation, [type, artifact]] of generations) {
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

    /**
     * Creates the specific artifact from the id and generation.
     * @param id The artifact id as a string.
     * @param generation The {@link Generation}.
     */
    protected abstract createArtifact(id: string, generation: Generation): TArtifact;
}
