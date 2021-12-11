// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { PartitionId } from '@dolittle/sdk.events';
import { Guid } from '@dolittle/rudiments';

/**
 * Represents the result from a partitioned filter.
 */
export class PartitionedFilterResult {
    readonly partitionId: PartitionId;

    /**
     * Initializes a new instance of {@link PartitionedFilterResult}.
     * @param {boolean} shouldInclude - Tells whether or not the event should be included.
     * @param {PartitionId | Guid | string} partitionId - Tells which partition the event should be partitioned into.
     */
    constructor(readonly shouldInclude: boolean, partitionId: PartitionId | Guid | string) {
        this.partitionId = PartitionId.from(partitionId);
    }
}
