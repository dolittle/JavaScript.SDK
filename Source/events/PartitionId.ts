// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { ConceptAs } from '@dolittle/concepts';

/**
 * Represents the unique identifier of a partition.
 */
export class PartitionId extends ConceptAs<Guid, '@dolittle/sdk.events.PartitionId'> {
    constructor(id: Guid) {
        super(id, '@dolittle/sdk.events.PartitionId');
    }

    /**
     * Gets the unspecified partition id
     */
    static unspecified: PartitionId = PartitionId.create(Guid.empty);

    static create(id?: Guid | string): PartitionId {
        return new PartitionId(id != null ? Guid.as(id) : Guid.create());
    }
};
