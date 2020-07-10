// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Artifact } from './Artifact';

export class ArtifactMap<T> implements Map<Artifact, T> {
    private _generationsById: Map<string, Map<number, T>>;

    constructor() {
        this._generationsById = new Map<string, Map<number, T>>();
    }

    get size(): number {
        let size = 0;
        for (const generations of this._generationsById.values()) {
            size += generations.size;
        }
        return size;
    }

    has(key: Artifact): boolean {
        const artifactId = key.id.toString();
        return this._generationsById.get(artifactId)?.has(key.generation) ?? false;
    }

    get(key: Artifact): T | undefined {
        const artifactId = key.id.toString();
        return this._generationsById.get(artifactId)?.get(key.generation);
    }

    set(key: Artifact, value: T): this {
        const artifactId = key.id.toString();

        let generations: Map<number, T>;
        if (this._generationsById.has(artifactId)) {
            generations = this._generationsById.get(artifactId)!;
        }
        else {
            generations = new Map<number, T>();
            this._generationsById.set(artifactId, generations);
        }
        generations.set(key.generation, value);

        return this;
    }

    clear(): void {
        this._generationsById.clear();
    }

    delete(key: Artifact): boolean {
        const artifactId = key.id.toString();

        const generations = this._generationsById.get(artifactId);
        if (generations) {
            const deleted = generations.delete(key.generation);
            if (generations.size === 0) {
                this._generationsById.delete(artifactId);
            }
            return deleted;
        }
        return false;
    }

    *[Symbol.iterator](): IterableIterator<[Artifact, T]> {
        for (const [artifactId, generations] of this._generationsById) {
            for (const [generation, entry] of generations) {
                const artifact = new Artifact(artifactId, generation);
                yield [artifact, entry];
            }
        }
    }

    entries(): IterableIterator<[Artifact, T]> {
        return this[Symbol.iterator]();
    }

    *keys(): IterableIterator<Artifact> {
        for (const [artifact, entry] of this.entries()) {
            yield artifact;
        }
    }

    *values(): IterableIterator<T> {
        for (const [artifact, entry] of this.entries()) {
            yield entry;
        }
    }

    forEach(callbackfn: (value: T, key: Artifact, map: Map<Artifact, T>) => void, thisArg?: any): void {
        for (const [artifact, entry] of this.entries()) {
            callbackfn.call(thisArg, entry, artifact, this);
        }
    }

    [Symbol.toStringTag]: string = 'ArtifactMap';
}
