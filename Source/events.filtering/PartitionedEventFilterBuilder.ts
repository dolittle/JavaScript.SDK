// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { IEventTypes } from '@dolittle/sdk.artifacts';
import { ScopeId } from '@dolittle/sdk.events';
import { ExecutionContext } from '@dolittle/sdk.execution';

import { FiltersClient } from '@dolittle/runtime.contracts/Runtime/Events.Processing/Filters_grpc_pb';

import { FilterId } from './FilterId';
import * as internal from './Internal';
import { PartitionedFilterEventCallback } from './PartitionedFilterEventCallback';
import { IFilterProcessor } from './IFilterProcessor';
import { MissingFilterCallback } from './MissingFilterCallback';

/**
 * Represents builder for building a partitioned event filter.
 */
export class PartitionedEventFilterBuilder {
    private _callback?: PartitionedFilterEventCallback;

    /**
     * Configured the handle callback.
     * @param {PartitionedFilterEventCallback} callback
     */
    handle(callback: PartitionedFilterEventCallback) {
        this._callback = callback;
    }

    /**
     * Builds partitioned event filter builder
     * @param {FilterId} filterId Unique identifier for the filter.
     * @param {ScopeId} scopeId The identifier of the scope the filter runs on.
     * @param {FiltersClient} client The client for working with the filters in the runtime.
     * @param {ExecutionContext} executionContext Execution context.
     * @param {IEventTypes} eventTypes Event types for identifying event types.
     * @param {Logger} logger Logger for logging.
     * @returns {IFilterProcessor}
     */
    build(
        filterId: FilterId,
        scopeId: ScopeId,
        client: FiltersClient,
        executionContext: ExecutionContext,
        eventTypes: IEventTypes,
        logger: Logger): IFilterProcessor {
        this.throwIfCallbackIsMissing(filterId, scopeId);
        return new internal.PartitionedEventFilterProcessor(filterId, scopeId, this._callback!, client, executionContext, eventTypes, logger);
    }

    private throwIfCallbackIsMissing(filterId: FilterId, scopeId: ScopeId) {
        if (!this._callback) {
            throw new MissingFilterCallback(filterId, scopeId);
        }
    }
}
