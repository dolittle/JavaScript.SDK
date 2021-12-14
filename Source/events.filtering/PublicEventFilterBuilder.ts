// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IEventTypes, ScopeId } from '@dolittle/sdk.events';

import { PublicEventFilterProcessor } from './Internal/PublicEventFilterProcessor';
import { FilterId } from './FilterId';
import { PartitionedFilterEventCallback } from './PartitionedFilterEventCallback';
import { IFilterProcessor } from './IFilterProcessor';
import { MissingFilterCallback } from './MissingFilterCallback';
import { IPublicEventFilterBuilder } from './IPublicEventFilterBuilder';

/**
 * Represents an implementation of {@link IPublicEventFilterBuilder}.
 */
export class PublicEventFilterBuilder extends IPublicEventFilterBuilder {
    private _callback?: PartitionedFilterEventCallback;

    /**
     * Initializes a new instance of {@link PublicEventFilterBuilder}.
     * @param {FilterId} _filterId - Identifier of the filter.
     */
    constructor(private _filterId: FilterId) {
        super();
    }

    /** @inheritdoc */
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
