// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IEventTypes, ScopeId } from '@dolittle/sdk.events';

import { PartitionedEventFilterProcessor } from './Internal/PartitionedEventFilterProcessor';
import { FilterId } from './FilterId';
import { IFilterProcessor } from './IFilterProcessor';
import { IPartitionedEventFilterBuilder } from './IPartitionedEventFilterBuilder';
import { MissingFilterCallback } from './MissingFilterCallback';
import { PartitionedFilterEventCallback } from './PartitionedFilterEventCallback';

/**
 * Represents an implementation of {@link IPartitionedEventFilterBuilder}.
 */
export class PartitionedEventFilterBuilder extends IPartitionedEventFilterBuilder {
    private _callback?: PartitionedFilterEventCallback;

    /** @inheritdoc */
    handle(callback: PartitionedFilterEventCallback): void {
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
