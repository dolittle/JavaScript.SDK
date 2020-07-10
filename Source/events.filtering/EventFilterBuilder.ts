// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { IArtifacts } from '@dolittle/sdk.artifacts';
import { IExecutionContextManager } from '@dolittle/sdk.execution';

import { FiltersClient } from '@dolittle/runtime.contracts/Runtime/Events.Processing/Filters_grpc_pb';

import { FilterId } from './FilterId';
import { PrivateEventFilterBuilder } from './PrivateEventFilterBuilder';
import { PublicEventFilterBuilder } from './PublicEventFilterBuilder';
import { IFilterProcessor } from './IFilterProcessor';
import { FilterDefinitionIncomplete } from './FilterDefinitionIncomplete';

export type EventFilterBuilderCallback = (builder: EventFilterBuilder) => void;

/**
 * Represents the builder of a specific event filter.
 */
export class EventFilterBuilder {
    private _innerBuilder?: PrivateEventFilterBuilder | PublicEventFilterBuilder;

    /**
     * Initializes a new instance of {@link EventFilterBuilder}.
     * @param {FilterId} _filterId Identifier of the filter.
     */
    constructor(private _filterId: FilterId) {}

    /**
     * Start building a private event filter.
     * @returns {PrivateEventFilterBuilder}
     */
    private(): PrivateEventFilterBuilder {
        const builder = this._innerBuilder = new PrivateEventFilterBuilder();
        return builder;
    }

    /**
     * Start building a public event filter.
     * @returns {PublicEventFilterBuilder}
     */
    public(): PublicEventFilterBuilder {
        const builder = this._innerBuilder = new PublicEventFilterBuilder();
        return builder;
    }

    /**
     * Build the event filter.
     * @param {FiltersClient} client The gRPC client for filters.
     * @param {IExecutionContextManager} executionContextManager Execution context manager.
     * @param {IArtifacts} artifacts For artifacts resolution.
     * @param {Logger} logger For logging.
     * @returns {IFilterProcessor}
     */
    build(client: FiltersClient, executionContextManager: IExecutionContextManager, artifacts: IArtifacts, logger: Logger): IFilterProcessor {
        if (!this._innerBuilder) {
            throw new FilterDefinitionIncomplete(this._filterId, 'call private() or public().');
        }
        return this._innerBuilder.build(this._filterId, client, executionContextManager, artifacts, logger);
    }
}
