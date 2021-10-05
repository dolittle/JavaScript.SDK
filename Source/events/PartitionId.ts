// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { ConceptAs } from '@dolittle/concepts';

/**
 * Represents the unique identifier of a partition.
 */
export class PartitionId extends ConceptAs<string, '@dolittle/sdk.events.PartitionId'> {
    constructor(id: string) {
        super(id, '@dolittle/sdk.events.PartitionId');
    }

    /**
     * Gets the unspecified partition id
     */
    static unspecified: PartitionId = PartitionId.from(Guid.empty.toString());

    /**
     * Creates a {PartitionId} from a guid.
     *
     * @static
     * @param {PartitionId |  string} id
     * @returns {PartitionId}
     */
    static from(id: PartitionId | string): PartitionId {
        if (id instanceof PartitionId) return id;
        return new PartitionId(id);
    }
};
