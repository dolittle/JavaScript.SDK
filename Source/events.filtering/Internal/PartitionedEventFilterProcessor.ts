// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { EventContext, IEventTypes, ScopeId } from '@dolittle/sdk.events';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { guids } from '@dolittle/sdk.protobuf';
import { Cancellation } from '@dolittle/sdk.resilience';
import { IReverseCallClient, ReverseCallClient, reactiveDuplex } from '@dolittle/sdk.services';

import { FiltersClient } from '@dolittle/runtime.contracts/Events.Processing/Filters_grpc_pb';
import { FilterEventRequest, FilterRegistrationResponse, FilterRuntimeToClientMessage } from '@dolittle/runtime.contracts/Events.Processing/Filters_pb';
import { PartitionedFilterClientToRuntimeMessage, PartitionedFilterRegistrationRequest, PartitionedFilterResponse } from '@dolittle/runtime.contracts/Events.Processing/PartitionedFilters_pb';
import { ProcessorFailure } from '@dolittle/runtime.contracts/Events.Processing/Processors_pb';

import { FilterEventProcessor } from './FilterEventProcessor';
import { FilterId, PartitionedFilterEventCallback } from '..';

/**
 * Represents an implementation of {@link FilterEventProcessor} that filters events to a partitioned stream.
 */
export class PartitionedEventFilterProcessor extends FilterEventProcessor<PartitionedFilterRegistrationRequest, PartitionedFilterResponse> {

    /**
     * Initialises a new instance of the {@link PartitionedEventFilterProcessor} class.
     * @param {FilterId} filterId - The filter id.
     * @param {ScopeId} _scopeId - The filter scope id.
     * @param {PartitionedFilterEventCallback} _callback - The filter callback.
     * @param {FiltersClient} _client - The filters client to use to register the filter.
     * @param {ExecutionContext} _executionContext - The execution context of the client.
     * @param {IEventTypes} eventTypes - All registered event types.
     * @param {Logger} logger - The logger to use for logging.
     */
    constructor(
        filterId: FilterId,
        private _scopeId: ScopeId,
        private _callback: PartitionedFilterEventCallback,
        private _client: FiltersClient,
        private _executionContext: ExecutionContext,
        eventTypes: IEventTypes,
        logger: Logger
    ) {
        super('Partitioned Filter', filterId, eventTypes, logger);
    }

    /** @inheritdoc */
    protected get registerArguments(): PartitionedFilterRegistrationRequest {
        const registerArguments = new PartitionedFilterRegistrationRequest();
        registerArguments.setFilterid(guids.toProtobuf(this._identifier.value));
        registerArguments.setScopeid(guids.toProtobuf(this._scopeId.value));
        return registerArguments;
    }

    /** @inheritdoc */
    protected createClient(
        registerArguments: PartitionedFilterRegistrationRequest,
        callback: (request: FilterEventRequest, executionContext: ExecutionContext) => Promise<PartitionedFilterResponse>,
        pingTimeout: number,
        cancellation: Cancellation): IReverseCallClient<FilterRegistrationResponse> {
        return new ReverseCallClient<PartitionedFilterClientToRuntimeMessage, FilterRuntimeToClientMessage, PartitionedFilterRegistrationRequest, FilterRegistrationResponse, FilterEventRequest, PartitionedFilterResponse> (
            (requests, cancellation) => reactiveDuplex(this._client, this._client.connectPartitioned, requests, cancellation),
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
            this._executionContext,
            registerArguments,
            pingTimeout,
            callback,
            cancellation,
            this._logger
        );
    }

    /** @inheritdoc */
    protected createResponseFromFailure(failure: ProcessorFailure): PartitionedFilterResponse {
        const response = new PartitionedFilterResponse();
        response.setFailure(failure);
        return response;
    }

    /** @inheritdoc */
    protected async filter(event: any, context: EventContext): Promise<PartitionedFilterResponse> {
        const result = await this._callback(event, context);

        const response = new PartitionedFilterResponse();
        response.setIsincluded(result.shouldInclude);
        response.setPartitionid(result.partitionId.value);
        return response;
    }
}
