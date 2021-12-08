// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { EventContext, IEventTypes } from '@dolittle/sdk.events';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { Cancellation } from '@dolittle/sdk.resilience';
import { IReverseCallClient, ReverseCallClient, reactiveDuplex } from '@dolittle/sdk.services';

import { FiltersClient } from '@dolittle/runtime.contracts/Events.Processing/Filters_grpc_pb';
import { FilterEventRequest, FilterRegistrationResponse, FilterRuntimeToClientMessage } from '@dolittle/runtime.contracts/Events.Processing/Filters_pb';
import { PartitionedFilterResponse } from '@dolittle/runtime.contracts/Events.Processing/PartitionedFilters_pb';
import { PublicFilterClientToRuntimeMessage, PublicFilterRegistrationRequest } from '@dolittle/runtime.contracts/Events.Processing/PublicFilters_pb';
import { ProcessorFailure } from '@dolittle/runtime.contracts/Events.Processing/Processors_pb';

import { FilterId, PartitionedFilterEventCallback } from '..';
import { FilterEventProcessor } from './FilterEventProcessor';

import '@dolittle/sdk.protobuf';

/**
 * Represents an implementation of {@link FilterEventProcessor} that filters public events to a public stream.
 */
export class PublicEventFilterProcessor extends FilterEventProcessor<PublicFilterRegistrationRequest, PartitionedFilterResponse> {

    /**
     * Initialises a new instance of the {@link PublicEventFilterProcessor} class.
     * @param {FilterId} filterId - The filter id.
     * @param {PartitionedFilterEventCallback} _callback - The filter callback.
     * @param {FiltersClient} _client - The filters client to use to register the filter.
     * @param {ExecutionContext} _executionContext - The execution context of the client.
     * @param {IEventTypes} eventTypes - All registered event types.
     */
    constructor(
        filterId: FilterId,
        private _callback: PartitionedFilterEventCallback,
        private _client: FiltersClient,
        private _executionContext: ExecutionContext,
        eventTypes: IEventTypes
    ) {
        super('Public Filter', filterId, eventTypes);
    }

    /** @inheritdoc */
    protected get registerArguments(): PublicFilterRegistrationRequest {
        const registerArguments = new PublicFilterRegistrationRequest();
        registerArguments.setFilterid(this._identifier.value.toProtobuf());
        return registerArguments;
    }

    /** @inheritdoc */
    protected createClient(
        registerArguments: PublicFilterRegistrationRequest,
        callback: (request: FilterEventRequest, executionContext: ExecutionContext) => Promise<PartitionedFilterResponse>,
        pingTimeout: number,
        logger: Logger,
        cancellation: Cancellation): IReverseCallClient<FilterRegistrationResponse> {
        return new ReverseCallClient<PublicFilterClientToRuntimeMessage, FilterRuntimeToClientMessage, PublicFilterRegistrationRequest, FilterRegistrationResponse, FilterEventRequest, PartitionedFilterResponse> (
            (requests, cancellation) => reactiveDuplex(this._client, this._client.connectPublic, requests, cancellation),
            PublicFilterClientToRuntimeMessage,
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
    protected async filter(event: any, context: EventContext, logger: Logger): Promise<PartitionedFilterResponse> {
        const result = await this._callback(event, context);

        const response = new PartitionedFilterResponse();
        response.setIsincluded(result.shouldInclude);
        response.setPartitionid(result.partitionId.value);
        return response;
    }
}
