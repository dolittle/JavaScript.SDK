// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { IEventTypes } from '@dolittle/sdk.artifacts';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { ScopeId } from '@dolittle/sdk.events';

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
     * @param {FilterId} _filterId Identifier of the filter.
     */
    constructor(private _filterId: FilterId) {}

    /**
     * Defines a callback for the filter.
     * @param {FilterEventCallback} callback The callback that will be called for each event.
     */
    handle(callback: PartitionedFilterEventCallback) {
        this._callback = callback;
    }

    /**
     * Build an instance of a {@link IFilterProcessor}.
     * @param {FilterId} filterId Unique identifier for the filter.
     * @param {FiltersClient} client The client for working with the filters in the runtime.
     * @param {ExecutionContext} executionContext Execution context.
     * @param {IEventTypes} eventTypes Event types for identifying event types.
     * @param {Logger} logger Logger for logging.
     * @returns {IFilterProcessor}
     */
    build(
        client: FiltersClient,
        executionContext: ExecutionContext,
        eventTypes: IEventTypes,
        logger: Logger): IFilterProcessor {

        this.throwIfCallbackIsMissing(this._filterId);
        return new internal.PublicEventFilterProcessor(this._filterId, this._callback!, client, executionContext, eventTypes, logger);
    }

    private throwIfCallbackIsMissing(filterId: FilterId) {
        if (!this._callback) {
            throw new MissingFilterCallback(filterId, ScopeId.default);
        }
    }
}
