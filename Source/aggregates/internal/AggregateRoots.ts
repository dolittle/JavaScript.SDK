// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { AggregateRootAliasRegistrationRequest } from '@dolittle/runtime.contracts/Aggregates/AggregateRoots_pb';
import { AggregateRootsClient } from '@dolittle/runtime.contracts/Aggregates/AggregateRoots_grpc_pb';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { artifacts, callContexts } from '@dolittle/sdk.protobuf';
import { Cancellation } from '@dolittle/sdk.resilience';
import { reactiveUnary } from '@dolittle/sdk.services';
import { Logger } from 'winston';
import { AggregateRootType, IAggregateRootTypes } from '../index';
/**
 * Represents a system that knows how to register Aggregate Roots with the Runtime.
 */
export class AggregateRoots {

    /**
     * Initializes an instance of the {@link EventTypes} class.
     * @param _client The event types client.
     * @param _executionContext The execution context.
     * @param _logger The logger.
     */
    constructor(readonly _client: AggregateRootsClient, readonly _executionContext: ExecutionContext, readonly _logger: Logger) {
    }

    /**
     * Registers event types.
     * @param eventTypes The event types to register.
     * @param cancellation The cancellation.
     */
    register(eventTypes: IAggregateRootTypes, cancellation: Cancellation): Promise<any> {
        return Promise.all(eventTypes.getAll().map(eventType => this.sendRequest(eventType, cancellation)));
    }

    private createRequest(aggregateRootType: AggregateRootType): AggregateRootAliasRegistrationRequest {
        const result = new AggregateRootAliasRegistrationRequest();
        result.setAggregateroot(artifacts.toProtobuf(aggregateRootType));
        result.setCallcontext(callContexts.toProtobuf(this._executionContext));
        if (aggregateRootType.hasAlias()) {
            result.setAlias(aggregateRootType.alias!.value);
        }
        return result;
    }

    private async sendRequest(aggregateRootType: AggregateRootType, cancellation: Cancellation): Promise<any> {
    const request = this.createRequest(aggregateRootType);
        this._logger.debug(`Registering Alias ${aggregateRootType.alias?.value} for Aggregate Root ${aggregateRootType.id.value.toString()}`);
        try {
            const response = await reactiveUnary(this._client, this._client.registerAlias, request, cancellation)
                .pipe().toPromise();
            if (response.hasFailure()) {
                this._logger.warn(`An error occurred while registering Alias ${aggregateRootType.alias?.value} for Aggregate Root ${aggregateRootType.id.value.toString()} because ${response.getFailure()?.getReason()}`);
            }
        } catch (err) {
            this._logger.warn(`An error occurred while registering Alias ${aggregateRootType.alias?.value} for Aggregate Root ${aggregateRootType.id.value.toString()}. Error ${err}`);
        }
    }
}