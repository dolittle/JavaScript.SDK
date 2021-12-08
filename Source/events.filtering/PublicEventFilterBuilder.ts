// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IClientBuildResults } from '@dolittle/sdk.common/ClientSetup';
import { IEventTypes, ScopeId } from '@dolittle/sdk.events';
import { ExecutionContext } from '@dolittle/sdk.execution';

import { FiltersClient } from '@dolittle/runtime.contracts/Events.Processing/Filters_grpc_pb';

import { FilterId } from './FilterId';
import { PartitionedFilterEventCallback } from './PartitionedFilterEventCallback';
import { IFilterProcessor } from './IFilterProcessor';
import * as internal from './Internal';
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
     * @param {FiltersClient} client - The client for working with the filters in the runtime.
     * @param {ExecutionContext} executionContext - Execution context.
     * @param {IEventTypes} eventTypes - Event types for identifying event types.
     * @param {IClientBuildResults} results - For keeping track of build results.
     * @returns {IFilterProcessor} The built filter processor.
     */
    build(
        client: FiltersClient,
        executionContext: ExecutionContext,
        eventTypes: IEventTypes,
        results: IClientBuildResults
    ): IFilterProcessor {

        this.throwIfCallbackIsMissing(this._filterId);
        return new internal.PublicEventFilterProcessor(this._filterId, this._callback!, client, executionContext, eventTypes, results);
    }

    private throwIfCallbackIsMissing(filterId: FilterId) {
        if (!this._callback) {
            throw new MissingFilterCallback(filterId, ScopeId.default);
        }
    }
}
