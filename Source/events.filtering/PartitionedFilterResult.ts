// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
import { PartitionId } from './PartitionId';

/**
 * Represents the result from a partitioned filter.
 */
export class PartitionedFilterResult {

    /**
     * Initializes a new instance of {@link PartitionedFilterResult}.
     * @param {boolean} shouldInclude Tells whether or not the event should be included.
     * @param {PartitionId} partitionId Tells which partition the event should be partitioned into.
     */
    constructor(readonly shouldInclude: boolean, readonly partitionId: PartitionId) { }
}
