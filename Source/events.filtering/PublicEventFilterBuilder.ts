// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IEventTypes, ScopeId } from '@dolittle/sdk.events';

import { PublicEventFilterProcessor } from './Internal/PublicEventFilterProcessor';
import { FilterId } from './FilterId';
import { PartitionedFilterEventCallback } from './PartitionedFilterEventCallback';
import { IFilterProcessor } from './IFilterProcessor';
import { MissingFilterCallback } from './MissingFilterCallback';

/**
 * Represents the builder for building public event filters.
 */
export class PublicEventFilterBuilder {
    private _callback?: PartitionedFilterEventCallback;

    /**
     * Initializes a new instance of {@link PublicEventFilterBuilder}.
     * @param {FilterId} _filterId - Identifier of the filter.
     */
    constructor(private _filterId: FilterId) {}

    /**
     * Defines a callback for the filter.
     * @param {PartitionedFilterEventCallback} callback - The callback that will be called for each event.
     */
    handle(callback: PartitionedFilterEventCallback) {
        this._callback = callback;
    }

    /**
     * Build an instance of a {@link IFilterProcessor}.
     * @param {IEventTypes} eventTypes - Event types for identifying event types.
     * @returns {IFilterProcessor} The built filter processor.
     */
    build(
        eventTypes: IEventTypes,
    ): IFilterProcessor {
        this.throwIfCallbackIsMissing(this._filterId);
        return new PublicEventFilterProcessor(this._filterId, this._callback!, eventTypes);
    }

    private throwIfCallbackIsMissing(filterId: FilterId) {
        if (!this._callback) {
            throw new MissingFilterCallback(filterId, ScopeId.default);
        }
    }
}
