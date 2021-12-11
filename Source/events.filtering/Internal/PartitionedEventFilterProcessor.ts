// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { IServiceProvider } from '@dolittle/sdk.common';
import { EventContext, IEventTypes, ScopeId } from '@dolittle/sdk.events';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { Cancellation } from '@dolittle/sdk.resilience';
import { IReverseCallClient, ReverseCallClient, reactiveDuplex } from '@dolittle/sdk.services';

import { FiltersClient } from '@dolittle/runtime.contracts/Events.Processing/Filters_grpc_pb';
import { FilterEventRequest, FilterRegistrationResponse, FilterRuntimeToClientMessage } from '@dolittle/runtime.contracts/Events.Processing/Filters_pb';
import { PartitionedFilterClientToRuntimeMessage, PartitionedFilterRegistrationRequest, PartitionedFilterResponse } from '@dolittle/runtime.contracts/Events.Processing/PartitionedFilters_pb';
import { ProcessorFailure } from '@dolittle/runtime.contracts/Events.Processing/Processors_pb';

import { FilterId } from '../FilterId';
import { PartitionedFilterEventCallback } from '../PartitionedFilterEventCallback';
import { FilterEventProcessor } from './FilterEventProcessor';

import '@dolittle/sdk.protobuf';

/**
 * Represents an implementation of {@link FilterEventProcessor} that filters events to a partitioned stream.
 */
export class PartitionedEventFilterProcessor extends FilterEventProcessor<PartitionedFilterRegistrationRequest, PartitionedFilterResponse> {

    /**
     * Initialises a new instance of the {@link PartitionedEventFilterProcessor} class.
     * @param {FilterId} filterId - The filter id.
     * @param {ScopeId} _scopeId - The filter scope id.
     * @param {PartitionedFilterEventCallback} _callback - The filter callback.
     * @param {IEventTypes} eventTypes - All registered event types.
     */
    constructor(
        filterId: FilterId,
        private _scopeId: ScopeId,
        private _callback: PartitionedFilterEventCallback,
        eventTypes: IEventTypes
    ) {
        super('Partitioned Filter', filterId, eventTypes);
    }

    /** @inheritdoc */
    protected get registerArguments(): PartitionedFilterRegistrationRequest {
        const registerArguments = new PartitionedFilterRegistrationRequest();
        registerArguments.setFilterid(this._identifier.value.toProtobuf());
        registerArguments.setScopeid(this._scopeId.value.toProtobuf());
        return registerArguments;
    }

    /** @inheritdoc */
    protected createClient(
        client: FiltersClient,
        registerArguments: PartitionedFilterRegistrationRequest,
        callback: (request: FilterEventRequest, executionContext: ExecutionContext) => Promise<PartitionedFilterResponse>,
        executionContext: ExecutionContext,
        pingTimeout: number,
        logger: Logger,
        cancellation: Cancellation
    ): IReverseCallClient<FilterRegistrationResponse> {
        return new ReverseCallClient<PartitionedFilterClientToRuntimeMessage, FilterRuntimeToClientMessage, PartitionedFilterRegistrationRequest, FilterRegistrationResponse, FilterEventRequest, PartitionedFilterResponse> (
            (requests, cancellation) => reactiveDuplex(client, client.connectPartitioned, requests, cancellation),
            PartitionedFilterClientToRuntimeMessage,
            (message, connectArguments) => message.setRegistrationrequest(connectArguments),
            (message) => message.getRegistrationresponse(),
            (message) => message.getFilterrequest(),
            (message, response) => message.setFilterresult(response),
            (connectArguments, context) => connectArguments.setCallcontext(context),
            (request) => request.getCallcontext(),
            (response, context) => response.setCallcontext(context),
            (message) => message.getPing(),
            (message, pong) => message.setPong(pong),
            executionContext,
            registerArguments,
            pingTimeout,
            callback,
            cancellation,
            logger
        );
    }

    /** @inheritdoc */
    protected createResponseFromFailure(failure: ProcessorFailure): PartitionedFilterResponse {
        const response = new PartitionedFilterResponse();
        response.setFailure(failure);
        return response;
    }

    /** @inheritdoc */
    protected async filter(event: any, context: EventContext, services: IServiceProvider, logger: Logger): Promise<PartitionedFilterResponse> {
        const result = await this._callback(event, context);

        const response = new PartitionedFilterResponse();
        response.setIsincluded(result.shouldInclude);
        response.setPartitionid(result.partitionId.value);
        return response;
    }
}
