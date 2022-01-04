// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IEquatable } from '@dolittle/rudiments';

import { IClientBuildResults } from '@dolittle/sdk.common';
import { IEventTypes } from '@dolittle/sdk.events';

import { PublicEventFilterProcessor } from './Internal/PublicEventFilterProcessor';
import { FilterId } from './FilterId';
import { PartitionedFilterEventCallback } from './PartitionedFilterEventCallback';
import { IFilterProcessor } from './IFilterProcessor';
import { IPublicEventFilterBuilder } from './IPublicEventFilterBuilder';

/**
 * Represents an implementation of {@link IPublicEventFilterBuilder}.
 */
export class PublicEventFilterBuilder extends IPublicEventFilterBuilder implements IEquatable {
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

    /** @inheritdoc */
    equals(other: any): boolean {
        return this === other;
    }

    /**
     * Build an instance of a {@link IFilterProcessor}.
     * @param {IEventTypes} eventTypes - For event types resolution.
     * @param {IClientBuildResults} results - For keeping track of build results.
     * @returns {IFilterProcessor | undefined} The built filter processor if successful.
     */
    build(eventTypes: IEventTypes, results: IClientBuildResults): IFilterProcessor | undefined {
        if (typeof this._callback !== 'function') {
            results.addFailure(`Filter callback is not configured for public filter '${this._filterId}'`, 'Call handle() on the builder to complete the filter configuration');
            return;
        }

        return new PublicEventFilterProcessor(this._filterId, this._callback!, eventTypes);
    }
}
