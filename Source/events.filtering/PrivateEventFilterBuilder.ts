// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { IArtifacts } from '@dolittle/sdk.artifacts';
import { ScopeId } from '@dolittle/sdk.events';
import { IExecutionContextManager } from '@dolittle/sdk.execution';

import { FiltersClient } from '@dolittle/runtime.contracts/Runtime/Events.Processing/Filters_grpc_pb';

import {
    PartitionedEventFilterBuilder, 
    UnpartitionedEventFilterBuilder,
    FilterEventCallback,
    FilterId,
    IFilterProcessor,
    FilterDefinitionIncomplete
} from './index';

/**
 * Represents the builder for building private event filters.
 */
export class PrivateEventFilterBuilder {
    private _scopeId: ScopeId = ScopeId.default;
    private _innerBuilder?: PartitionedEventFilterBuilder | UnpartitionedEventFilterBuilder;

    /**
     * Get the {@link ScopeId} the filter operates on.
     */
    get scopeId() {
        return this._scopeId;
    }

    /**
     * Defines which {@link ScopeId} the filter operates on.
     * @param {ScopeId} scopeId Scope the filter operates on.
     * @returns {PrivateEventFilterBuilder}
     */
    inScope(scopeId: ScopeId): PrivateEventFilterBuilder {
        this._scopeId = scopeId;
        return this;
    }

    /**
     * Defines the filter to be partitioned.
     * @returns {PrivateEventFilterBuilder}
     */
    partitioned(): PartitionedEventFilterBuilder {
        this._innerBuilder = new PartitionedEventFilterBuilder();
        return this._innerBuilder;
    }

    /**
     * Defines a callback for the filter.
     * @param {FilterEventCallback} callback The callback that will be called for each event.
     */
    handle(callback: FilterEventCallback) {
        this._innerBuilder = new UnpartitionedEventFilterBuilder();
        this._innerBuilder.handle(callback);
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
        client: FiltersClient,
        executionContextManager: IExecutionContextManager,
        artifacts: IArtifacts,
        logger: Logger): IFilterProcessor {

        if (!this._innerBuilder) {
            throw new FilterDefinitionIncomplete(filterId, 'call partitioned() or handle(...).');
        }
        return this._innerBuilder.build(filterId, this._scopeId, client, executionContextManager, artifacts, logger);
    }
}
