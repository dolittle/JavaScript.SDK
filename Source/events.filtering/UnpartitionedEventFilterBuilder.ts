// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { IArtifacts } from '@dolittle/sdk.artifacts';
import { ScopeId } from '@dolittle/sdk.events';
import { IExecutionContextManager } from '@dolittle/sdk.execution';

import { FiltersClient } from '@dolittle/runtime.contracts/Runtime/Events.Processing/Filters_grpc_pb';

import { FilterId } from './FilterId';
import { FilterEventCallback } from './FilterEventCallback';
import { EventFilterProcessor } from './Internal/EventFilterProcessor';
import { MissingFilterCallback } from './MissingFilterCallback';
import { IFilterProcessor } from './IFilterProcessor';

/**
 * Represents the builder for building public event filters.
 */
export class UnpartitionedEventFilterBuilder {
    private _callback?: FilterEventCallback;

    /**
     * Defines a callback for the filter.
     * @param {FilterEventCallback} callback The callback that will be called for each event.
     */
    handle(callback: FilterEventCallback) {
        this._callback = callback;
    }

    /**
     * Build an instance of a {@link IFilterProcessor}.
     * @param {FilterId} filterId Unique identifier for the filter.
     * @param {FiltersClient} client The client for working with the filters in the runtime.
     * @param {IExecutionContextManager} executionContextManager Execution context manager for working with execution context.
     * @param {IArtifacts} artifacts Artifacts for identifying artifacts.
     * @param {Logger} logger Logger for logging.
     * @returns {IFilterProcessor}
     */
    build(
        filterId: FilterId,
        scopeId: ScopeId,
        client: FiltersClient,
        executionContextManager: IExecutionContextManager,
        artifacts: IArtifacts,
        logger: Logger): IFilterProcessor {

        this.throwIfCallbackIsMissing(filterId, scopeId);
        return new EventFilterProcessor(filterId, scopeId, this._callback!, client, executionContextManager, artifacts, logger);
    }

    private throwIfCallbackIsMissing(filterId: FilterId, scopeId: ScopeId) {
        if (!this._callback) {
            throw new MissingFilterCallback(filterId, scopeId);
        }
    }
}
