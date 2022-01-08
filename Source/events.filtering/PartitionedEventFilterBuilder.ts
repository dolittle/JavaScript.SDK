// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IClientBuildResults } from '@dolittle/sdk.common';
import { IEventTypes, ScopeId } from '@dolittle/sdk.events';

import { PartitionedEventFilterProcessor } from './Internal/PartitionedEventFilterProcessor';
import { FilterId } from './FilterId';
import { IFilterProcessor } from './IFilterProcessor';
import { IPartitionedEventFilterBuilder } from './IPartitionedEventFilterBuilder';
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
     * Build an instance of a {@link IFilterProcessor}.
     * @param {FilterId} filterId - Unique identifier for the filter.
     * @param {ScopeId} scopeId - The scope of the filter.
     * @param {IEventTypes} eventTypes - For event types resolution.
     * @param {IClientBuildResults} results - For keeping track of build results.
     * @returns {IFilterProcessor | undefined} The built filter processor if successful.
     */
    build(filterId: FilterId, scopeId: ScopeId, eventTypes: IEventTypes, results: IClientBuildResults): IFilterProcessor | undefined {
        if (typeof this._callback !== 'function') {
            results.addFailure(`Filter callback is not configured for partitioned private filter '${filterId}' in scope '${scopeId}'`, 'Call handle() on the builder to complete the filter configuration');
            return;
        }

        return new PartitionedEventFilterProcessor(filterId, scopeId, this._callback!, eventTypes);
    }
}
