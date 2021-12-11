// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Artifact, Generation, GenerationLike } from '@dolittle/sdk.artifacts';
import { AggregateRootId, AggregateRootIdLike } from '@dolittle/sdk.events';
import { AggregateRootTypeAlias } from './AggregateRootTypeAlias';

/**
 * Represents the type of an aggregate root.
 */
export class AggregateRootType extends Artifact<AggregateRootId> {
    /**
     * Initializes a new instance of {@link EventType}.
     * @param {AggregateRootType} id - The unique identifier of the aggregate root type.
     * @param {Generation} [generation = Generation.first] - Optional generation - will default to {@link generation.first}.
     * @param {AggregateRootTypeAlias} [alias = undefined] - Optional alias.
     */
    constructor(id: AggregateRootId, generation: Generation = Generation.first, readonly alias?: AggregateRootTypeAlias) {
        super(id, generation);
    }

    /**
     * Gets a value indicating whether there is an alias for the aggregate root type.
     * @returns {boolean} A value indicating whether there is an alias for the aggregate root type.
     */
    hasAlias() {
        return this.alias !== undefined;
    }

    /** @inheritdoc */
    toString() {
        return `AggregateRootType(${this.id}, ${this.generation})`;
    }

    /**
     * Creates an instance of {@link AggregateRootType}.
     * @param {AggregateRootIdLike} id - The aggregate root type id.
     * @param {GenerationLike | undefined} generation - The optional generation of the aggregate root type.
     * @returns {AggregateRootType} The created aggregate root type.
     */
    static from(id: AggregateRootIdLike, generation?: GenerationLike): AggregateRootType {
        if (generation === undefined) {
            generation = Generation.first;
        }

        return new AggregateRootType(AggregateRootId.from(id), Generation.from(generation));
    }
}
