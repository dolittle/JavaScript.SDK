// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IEventTypes, ScopeId } from '@dolittle/sdk.events';

import { PartitionedEventFilterProcessor } from './Internal/PartitionedEventFilterProcessor';
import { FilterId } from './FilterId';
import { PartitionedFilterEventCallback } from './PartitionedFilterEventCallback';
import { IFilterProcessor } from './IFilterProcessor';
import { MissingFilterCallback } from './MissingFilterCallback';

/**
 * Represents builder for building a partitioned event filter.
 */
export class PartitionedEventFilterBuilder {
    private _callback?: PartitionedFilterEventCallback;

    /**
     * Configured the handle callback.
     * @param {PartitionedFilterEventCallback} callback - The callback that will be called for each event.
     */
    handle(callback: PartitionedFilterEventCallback) {
        this._callback = callback;
    }

    /**
     * Builds partitioned event filter builder.
     * @param {FilterId} filterId - Unique identifier for the filter.
     * @param {ScopeId} scopeId - The identifier of the scope the filter runs on.
     * @param {IEventTypes} eventTypes - Event types for identifying event types.
     * @returns {IFilterProcessor} The built filter processor.
     */
    build(
        filterId: FilterId,
        scopeId: ScopeId,
        eventTypes: IEventTypes
    ): IFilterProcessor {
        this.throwIfCallbackIsMissing(filterId, scopeId);
        return new PartitionedEventFilterProcessor(filterId, scopeId, this._callback!, eventTypes);
    }

    private throwIfCallbackIsMissing(filterId: FilterId, scopeId: ScopeId) {
        if (!this._callback) {
            throw new MissingFilterCallback(filterId, scopeId);
        }
    }
}
