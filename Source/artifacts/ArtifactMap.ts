// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Artifact, ArtifactId, Generation } from './index';
import { Guid } from '@dolittle/rudiments';

/**
 * Represents a map for mapping an artifact to a given type and provide.
 * @template T Type to map to.
 */
export class ArtifactMap<T> implements Map<Artifact, T> {
    private _generationsById: Map<string, Map<number, T>>;

    /**
     * Initializes a new instance of {@link ArtifactMap}
     */
    constructor() {
        this._generationsById = new Map<string, Map<number, T>>();
    }

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
    has(key: Artifact): boolean {
        const artifactId = key.id.toString();
        return this._generationsById.get(artifactId)?.has(key.generation.value) ?? false;
    }

    /** @inheritdoc */
    get(key: Artifact): T | undefined {
        const artifactId = key.id.toString();
        return this._generationsById.get(artifactId)?.get(key.generation.value);
    }

    /** @inheritdoc */
    set(key: Artifact, value: T): this {
        const artifactId = key.id.toString();

        let generations: Map<number, T>;
        if (this._generationsById.has(artifactId)) {
            generations = this._generationsById.get(artifactId)!;
        } else {
            generations = new Map<number, T>();
            this._generationsById.set(artifactId, generations);
        }
        generations.set(key.generation.value, value);

        return this;
    }

    /** @inheritdoc */
    clear(): void {
        this._generationsById.clear();
    }

    /** @inheritdoc */
    delete(key: Artifact): boolean {
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
    *[Symbol.iterator](): IterableIterator<[Artifact, T]> {
        for (const [artifactId, generations] of this._generationsById) {
            for (const [generation, entry] of generations) {
                const artifact = new Artifact(ArtifactId.create(artifactId), Generation.create(generation));
                yield [artifact, entry];
            }
        }
    }

    /** @inheritdoc */
    entries(): IterableIterator<[Artifact, T]> {
        return this[Symbol.iterator]();
    }

    /** @inheritdoc */
    *keys(): IterableIterator<Artifact> {
        for (const [artifact, entry] of this.entries()) {
            yield artifact;
        }
    }

    /** @inheritdoc */
    *values(): IterableIterator<T> {
        for (const [artifact, entry] of this.entries()) {
            yield entry;
        }
    }

    /** @inheritdoc */
    forEach(callbackfn: (value: T, key: Artifact, map: Map<Artifact, T>) => void, thisArg?: any): void {
        for (const [artifact, entry] of this.entries()) {
            callbackfn.call(thisArg, entry, artifact, this);
        }
    }

    /** @inheritdoc */
    [Symbol.toStringTag] = 'ArtifactMap';
}
