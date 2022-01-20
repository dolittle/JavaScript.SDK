// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { PartitionedFilterEventCallback } from './PartitionedFilterEventCallback';

/**
 * Defines a builder for building a public event filter.
 */
export abstract class IPublicEventFilterBuilder {
    /**
     * Defines a callback for the filter.
     * @param {PartitionedFilterEventCallback} callback - The callback that will be called for each event.
     */
    abstract handle(callback: PartitionedFilterEventCallback): void;
}
