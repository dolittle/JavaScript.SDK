// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { IArtifacts } from '@dolittle/sdk.artifacts';
import { ScopeId } from '@dolittle/sdk.events';
import { ExecutionContext } from '@dolittle/sdk.execution';

import { FiltersClient } from '@dolittle/runtime.contracts/Runtime/Events.Processing/Filters_grpc_pb';

import { FilterId } from './FilterId';
import * as internal from './Internal';
import { PartitionedFilterEventCallback } from './PartitionedFilterEventCallback';
import { IFilterProcessor } from './IFilterProcessor';
import { MissingFilterCallback } from './MissingFilterCallback';
import { Guid } from '@dolittle/rudiments';

/**
 * Represents builder for building a partitioned event filter.
 */
export class PartitionedEventFilterBuilder {
    private _callback?: PartitionedFilterEventCallback;
    private _scopeId: ScopeId = ScopeId.default;

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
    inScope(scopeId: Guid | string): PartitionedEventFilterBuilder {
        this._scopeId = ScopeId.from(scopeId);
        return this;
    }

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
     * @param {IArtifacts} artifacts Artifacts for identifying artifacts.
     * @param {Logger} logger Logger for logging.
     * @returns {IFilterProcessor}
     */
    build(
        filterId: FilterId,
        scopeId: ScopeId,
        client: FiltersClient,
        executionContext: ExecutionContext,
        artifacts: IArtifacts,
        logger: Logger): IFilterProcessor {
        this.throwIfCallbackIsMissing(filterId, scopeId);
        return new internal.PartitionedEventFilterProcessor(filterId, scopeId, this._callback!, client, executionContext, artifacts, logger);
    }

    private throwIfCallbackIsMissing(filterId: FilterId, scopeId: ScopeId) {
        if (!this._callback) {
            throw new MissingFilterCallback(filterId, scopeId);
        }
    }
}
