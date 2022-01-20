// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { PartitionedFilterEventCallback } from './PartitionedFilterEventCallback';

/**
 * Defines a builder for building a partitioned event filter.
 */
export abstract class IPartitionedEventFilterBuilder {
    /**
     * Configured the handle callback.
     * @param {PartitionedFilterEventCallback} callback - The callback that will be called for each event.
     */
    abstract handle(callback: PartitionedFilterEventCallback): void;
}
