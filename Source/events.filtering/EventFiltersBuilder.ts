// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { Guid } from '@dolittle/rudiments';

import { IArtifacts } from '@dolittle/sdk.artifacts';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { Cancellation } from '@dolittle/sdk.resilience';

import { FiltersClient } from '@dolittle/runtime.contracts/Runtime/Events.Processing/Filters_grpc_pb';

import { FilterId } from './FilterId';
import { Filters } from './Filters';
import { IFilters } from './IFilters';
import { PublicEventFilterBuilder } from './PublicEventFilterBuilder';
import { PrivateEventFilterBuilder } from './PrivateEventFilterBuilder';


export type EventFiltersBuilderCallback = (builder: EventFiltersBuilder) => void;
export type PrivateEventFilterBuilderCallback = (builder: PrivateEventFilterBuilder) => void;
export type PublicEventFilterBuilderCallback = (builder: PublicEventFilterBuilder) => void;

/**
 * Represents the builder for building event filters.
 */
export class EventFiltersBuilder {
    private _privateFilterBuilders: PrivateEventFilterBuilder[]  = [];
    private _publicFilterBuilders: PublicEventFilterBuilder[]  = [];

    /**
     * Start building for a specific filter.
     * @param {Guid | string} filterId The identifier of the filter.
     * @param {PrivateEventFilterBuilderCallback} callback Callback for building the event filter.
     * @returns {EventFiltersBuilder} Continuation of the builder
     */
    createPrivateFilter(filterId: Guid | string, callback: PrivateEventFilterBuilderCallback): EventFiltersBuilder {
        const builder = new PrivateEventFilterBuilder(FilterId.from(filterId));
        callback(builder);
        this._privateFilterBuilders.push(builder);
        return this;
    }

    /**
     * Start building for a specific filter.
     * @param {Guid | string} filterId The identifier of the filter.
     * @param {PublicEventFilterBuilderCallback} callback Callback for building the event filter.
     * @returns {EventFiltersBuilder} Continuation of the builder
     */
    createPublicFilter(filterId: Guid | string, callback: PublicEventFilterBuilderCallback): EventFiltersBuilder {
        const builder = new PublicEventFilterBuilder(FilterId.from(filterId));
        callback(builder);
        this._publicFilterBuilders.push(builder);
        return this;
    }

    /**
     * Builds all the event filters.
     * @param {FiltersClient} client The gRPC client for filters.
     * @param {IExecutionContextManager} executionContextManager Execution context manager.
     * @param {IArtifacts} artifacts For artifacts resolution.
     * @param {Logger} logger For logging.
     */
    build(
        client: FiltersClient,
        executionContext: ExecutionContext,
        artifacts: IArtifacts,
        logger: Logger,
        cancellation: Cancellation): IFilters {
        const filters = new Filters(logger);

        for (const privateFilterBuilder of this._privateFilterBuilders) {
            const filterProcessor = privateFilterBuilder.build(client, executionContext, artifacts, logger);
            filters.register(filterProcessor, cancellation);
        }
        for (const publicFilterBuilder of this._publicFilterBuilders) {
            const filterProcessor = publicFilterBuilder.build(client, executionContext, artifacts, logger);
            filters.register(filterProcessor, cancellation);
        }

        return filters;
    }
}
