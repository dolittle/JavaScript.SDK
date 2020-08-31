// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { IArtifacts } from '@dolittle/sdk.artifacts';
import { IExecutionContextManager } from '@dolittle/sdk.execution';
import { Cancellation } from '@dolittle/sdk.resilience';

import { FiltersClient } from '@dolittle/runtime.contracts/Runtime/Events.Processing/Filters_grpc_pb';

import { FilterId, Filters, IFilters, EventFilterBuilder, EventFilterBuilderCallback } from './index';
import { Guid } from '@dolittle/rudiments';


export type EventFiltersBuilderCallback = (builder: EventFiltersBuilder) => void;

/**
 * Represents the builder for building event filters.
 */
export class EventFiltersBuilder {
    private _eventFilterBuilders: EventFilterBuilder[] = [];

    /**
     * Start building for a specific filter.
     * @param {Guid | string} filterId The identifier of the filter.
     * @param {EventFilterBuilderCallback} callback Callback for building the event filter.
     * @returns {EventFiltersBuilder} Continuation of the builder
     */
    for(filterId: Guid | string, callback: EventFilterBuilderCallback): EventFiltersBuilder {
        const builder = new EventFilterBuilder(FilterId.from(filterId));
        callback(builder);
        this._eventFilterBuilders.push(builder);
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
        executionContextManager: IExecutionContextManager,
        artifacts: IArtifacts,
        logger: Logger,
        cancellation: Cancellation): IFilters {
        const filters = new Filters(logger);

        for (const eventFilterBuilder of this._eventFilterBuilders) {
            const filterProcessor = eventFilterBuilder.build(client, executionContextManager, artifacts, logger);
            filters.register(filterProcessor, cancellation);
        }

        return filters;
    }
}
