// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { FilterEventCallback } from './FilterEventCallback';

/**
 * Defines a builder for building an unpartitioned event filter.
 */
export abstract class IUnpartitionedEventFilterBuilder {
    /**
     * Defines a callback for the filter.
     * @param {FilterEventCallback} callback - The callback that will be called for each event.
     */
    abstract handle(callback: FilterEventCallback): void;
}
