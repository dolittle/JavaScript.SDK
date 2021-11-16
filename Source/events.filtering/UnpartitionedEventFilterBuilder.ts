// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { IEventTypes, ScopeId } from '@dolittle/sdk.events';
import { ExecutionContext } from '@dolittle/sdk.execution';

import { FiltersClient } from '@dolittle/runtime.contracts/Events.Processing/Filters_grpc_pb';

import { FilterId } from './FilterId';
import { FilterEventCallback } from './FilterEventCallback';
import { IFilterProcessor } from './IFilterProcessor';
import { MissingFilterCallback } from './MissingFilterCallback';
import * as internal from './Internal';

/**
 * Represents the builder for building public event filters.
 */
export class UnpartitionedEventFilterBuilder {
    private _callback?: FilterEventCallback;

    /**
     * Defines a callback for the filter.
     * @param {FilterEventCallback} callback - The callback that will be called for each event.
     */
    handle(callback: FilterEventCallback) {
        this._callback = callback;
    }

    /**
     * Build an instance of a {@link IFilterProcessor}.
     * @param {FilterId} filterId - Unique identifier for the filter.
     * @param scopeId
     * @param {FiltersClient} client - The client for working with the filters in the runtime.
     * @param {ExecutionContext} executionContext - Execution context.
     * @param {IEventTypes} eventTypes - Event types for identifying event types.
     * @param {Logger} logger - Logger for logging.
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
        return new internal.EventFilterProcessor(filterId, scopeId, this._callback!, client, executionContext, eventTypes, logger);
    }

    private throwIfCallbackIsMissing(filterId: FilterId, scopeId: ScopeId) {
        if (!this._callback) {
            throw new MissingFilterCallback(filterId, scopeId);
        }
    }
}
