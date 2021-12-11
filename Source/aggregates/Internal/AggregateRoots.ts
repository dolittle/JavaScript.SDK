// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { ExecutionContext } from '@dolittle/sdk.execution';
import { Cancellation } from '@dolittle/sdk.resilience';
import { reactiveUnary } from '@dolittle/sdk.services';

import { AggregateRootAliasRegistrationRequest } from '@dolittle/runtime.contracts/Aggregates/AggregateRoots_pb';
import { AggregateRootsClient } from '@dolittle/runtime.contracts/Aggregates/AggregateRoots_grpc_pb';

import { AggregateRootType } from '../AggregateRootType';
import { IAggregateRootTypes } from '../IAggregateRootTypes';

import '@dolittle/sdk.protobuf';

/**
 * Represents a system that knows how to register Aggregate Roots with the Runtime.
 */
export class AggregateRoots {

    /**
     * Initializes an instance of the {@link AggregateRoots} class.
     * @param {AggregateRootsClient} _client - The aggregate roots client.
     * @param {ExecutionContext} _executionContext - The execution context.
     * @param {Logger} _logger - The logger.
     */
    constructor(
        private readonly _client: AggregateRootsClient,
        private readonly _executionContext: ExecutionContext,
        private readonly _logger: Logger
    ) {}

    /**
     * Registers aggregate roots.
     * @param {IAggregateRootTypes} aggregateRootTypes - The aggregate root types to register.
     * @param {Cancellation} cancellation - The cancellation.
     * @returns {Promise<void>} A {@link Promise} that represents the asynchronous operation.
     */
    register(aggregateRootTypes: IAggregateRootTypes, cancellation: Cancellation): Promise<void> {
        return Promise.all(aggregateRootTypes.getAll().map(eventType => this.sendRequest(eventType, cancellation))) as unknown as Promise<void>;
    }

    private createRequest(aggregateRootType: AggregateRootType): AggregateRootAliasRegistrationRequest {
        const result = new AggregateRootAliasRegistrationRequest();
        result.setAggregateroot(aggregateRootType.toProtobuf());
        result.setCallcontext(this._executionContext.toCallContext());
        if (aggregateRootType.hasAlias()) {
            result.setAlias(aggregateRootType.alias!.value);
        }
        return result;
    }

    private async sendRequest(aggregateRootType: AggregateRootType, cancellation: Cancellation): Promise<void> {
        const request = this.createRequest(aggregateRootType);
        this._logger.debug(`Registering Alias ${aggregateRootType.alias?.value} for Aggregate Root ${aggregateRootType.id.value.toString()}`);
        try {
            const response = await reactiveUnary(this._client, this._client.registerAlias, request, cancellation).toPromise();
            if (response.hasFailure()) {
                this._logger.warn(`An error occurred while registering Alias ${aggregateRootType.alias?.value} for Aggregate Root ${aggregateRootType.id.value.toString()} because ${response.getFailure()?.getReason()}`);
            }
        } catch (err) {
            this._logger.warn(`An error occurred while registering Alias ${aggregateRootType.alias?.value} for Aggregate Root ${aggregateRootType.id.value.toString()}. Error ${err}`);
        }
    }
}
