// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { ConceptAs } from '@dolittle/concepts';

/**
 * Represents the unique identifier of a partition.
 */
export class PartitionId extends ConceptAs<string, '@dolittle/sdk.events.PartitionId'> {
    /**
     * Initialises a new instance of the {@link PartitionId} class.
     * @param {string} id - The partition id.
     */
    constructor(id: string) {
        super(id, '@dolittle/sdk.events.PartitionId');
    }

    /**
     * Gets the unspecified partition id.
     */
    static unspecified: PartitionId = PartitionId.from(Guid.empty.toString());

    /**
     * Creates a {@link PartitionId} from a {@link Guid} or a {@link string}.
     * @param {PartitionId | Guid | string} id - The partition id.
     * @returns {PartitionId} The created partition id concept.
     */
    static from(id: PartitionId | Guid | string): PartitionId {
        if (id instanceof PartitionId) return id;
        return new PartitionId(id.toString());
    }
};
