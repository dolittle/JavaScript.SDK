// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { IEventTypes, ScopeId } from '@dolittle/sdk.events';
import { ExecutionContext } from '@dolittle/sdk.execution';

import { FiltersClient } from '@dolittle/runtime.contracts/Events.Processing/Filters_grpc_pb';

import { PartitionedEventFilterBuilder } from './PartitionedEventFilterBuilder';
import { UnpartitionedEventFilterBuilder } from './UnpartitionedEventFilterBuilder';
import { FilterId } from './FilterId';
import { IFilterProcessor } from './IFilterProcessor';
import { FilterDefinitionIncomplete } from './FilterDefinitionIncomplete';
import { Guid } from '@dolittle/rudiments';

/**
 * Represents the builder for building private event filters.
 */
export class PrivateEventFilterBuilder {
    private _scopeId: ScopeId = ScopeId.default;
    private _innerBuilder?: PartitionedEventFilterBuilder | UnpartitionedEventFilterBuilder;

    /**
     * Initializes a new instance of {@link PrivateEventFilterBuilder}.
     * @param {FilterId} _filterId Identifier of the filter.
     */
    constructor(private _filterId: FilterId) {}

    /**
     * Defines which {@link ScopeId} the filter operates on.
     * @param {ScopeId | Guid | string} scopeId Scope the filter operates on.
     * @returns {PrivateEventFilterBuilder}
     */
    inScope(scopeId: ScopeId | Guid | string): PrivateEventFilterBuilder {
        this._scopeId = ScopeId.from(scopeId);
        return this;
    }

    /**
     * Defines the filter to be partitioned.
     * @returns {PartitionedEventFilterBuilder}
     */
    partitioned(): PartitionedEventFilterBuilder {
        this._innerBuilder = new PartitionedEventFilterBuilder();
        return this._innerBuilder;
    }

    /**
     * Defines the filter to be unpartitioned.
     * @returns {UnpartitionedEventFilterBuilder}
     */
    unpartitioned(): UnpartitionedEventFilterBuilder {
        this._innerBuilder = new UnpartitionedEventFilterBuilder();
        return this._innerBuilder;
    }

    /**
     * Build an instance of a {@link IFilterProcessor}.
     * @param {FilterId} filterId Unique identifier for the filter.
     * @param {FiltersClient} client The client for working with the filters in the runtime.
     * @param {ExecutionContext} executionContext Execution context manager for working with execution context.
     * @param {IEventTypes} eventTypes Event types for identifying event types.
     * @param {Logger} logger Logger for logging.
     * @returns {IFilterProcessor}
     */
    build(
        client: FiltersClient,
        executionContext: ExecutionContext,
        eventTypes: IEventTypes,
        logger: Logger): IFilterProcessor {

        if (!this._innerBuilder) {
            throw new FilterDefinitionIncomplete(this._filterId, 'call partitioned() or unpartitioned().');
        }
        return this._innerBuilder.build(this._filterId, this._scopeId, client, executionContext, eventTypes, logger);
    }
}
