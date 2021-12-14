// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IEventTypes, ScopeId } from '@dolittle/sdk.events';

import { EventFilterProcessor } from './Internal/EventFilterProcessor';
import { FilterId } from './FilterId';
import { FilterEventCallback } from './FilterEventCallback';
import { IFilterProcessor } from './IFilterProcessor';
import { IUnpartitionedEventFilterBuilder } from './IUnpartitionedEventFilterBuilder';
import { MissingFilterCallback } from './MissingFilterCallback';

/**
 * Represents an implementation of {@link IUnpartitionedEventFilterBuilder}.
 */
export class UnpartitionedEventFilterBuilder extends IUnpartitionedEventFilterBuilder {
    private _callback?: FilterEventCallback;

    /** @inheritdoc */
    handle(callback: FilterEventCallback): void {
        this._callback = callback;
    }

    /**
     * Build an instance of a {@link IFilterProcessor}.
     * @param {FilterId} filterId - Unique identifier for the filter.
     * @param {ScopeId} scopeId - The scope of the filter.
     * @param {IEventTypes} eventTypes - Event types for identifying event types.
     * @returns {IFilterProcessor} The built filter processor.
     */
    build(
        filterId: FilterId,
        scopeId: ScopeId,
        eventTypes: IEventTypes,
    ): IFilterProcessor {
        this.throwIfCallbackIsMissing(filterId, scopeId);
        return new EventFilterProcessor(filterId, scopeId, this._callback!, eventTypes);
    }

    private throwIfCallbackIsMissing(filterId: FilterId, scopeId: ScopeId) {
        if (!this._callback) {
            throw new MissingFilterCallback(filterId, scopeId);
        }
    }
}
