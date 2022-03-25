// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { IServiceProvider } from '@dolittle/sdk.dependencyinversion';
import { EventContext, IEventTypes } from '@dolittle/sdk.events';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { Guids } from '@dolittle/sdk.protobuf';
import { Cancellation } from '@dolittle/sdk.resilience';
import { IReverseCallClient, ReverseCallClient, reactiveDuplex } from '@dolittle/sdk.services';

import { FiltersClient } from '@dolittle/contracts/Runtime/Events.Processing/Filters_grpc_pb';
import { FilterEventRequest, FilterRegistrationResponse, FilterRuntimeToClientMessage } from '@dolittle/contracts/Runtime/Events.Processing/Filters_pb';
import { PartitionedFilterResponse } from '@dolittle/contracts/Runtime/Events.Processing/PartitionedFilters_pb';
import { PublicFilterClientToRuntimeMessage, PublicFilterRegistrationRequest } from '@dolittle/contracts/Runtime/Events.Processing/PublicFilters_pb';
import { ProcessorFailure } from '@dolittle/contracts/Runtime/Events.Processing/Processors_pb';

import { FilterId } from '../FilterId';
import { PartitionedFilterEventCallback } from '../PartitionedFilterEventCallback';
import { FilterEventProcessor } from './FilterEventProcessor';

/**
 * Represents an implementation of {@link FilterEventProcessor} that filters public events to a public stream.
 */
export class PublicEventFilterProcessor extends FilterEventProcessor<PublicFilterRegistrationRequest, PartitionedFilterResponse> {

    /**
     * Initialises a new instance of the {@link PublicEventFilterProcessor} class.
     * @param {FilterId} filterId - The filter id.
     * @param {PartitionedFilterEventCallback} _callback - The filter callback.
     * @param {IEventTypes} eventTypes - All registered event types.
     */
    constructor(
        filterId: FilterId,
        private _callback: PartitionedFilterEventCallback,
        eventTypes: IEventTypes
    ) {
        super('Public Filter', filterId, eventTypes);
    }

    /** @inheritdoc */
    protected get registerArguments(): PublicFilterRegistrationRequest {
        const registerArguments = new PublicFilterRegistrationRequest();
        registerArguments.setFilterid(Guids.toProtobuf(this._identifier.value));
        return registerArguments;
    }

    /** @inheritdoc */
    protected createClient(
        client: FiltersClient,
        registerArguments: PublicFilterRegistrationRequest,
        callback: (request: FilterEventRequest, executionContext: ExecutionContext) => Promise<PartitionedFilterResponse>,
        executionContext: ExecutionContext,
        pingInterval: number,
        logger: Logger,
        cancellation: Cancellation
    ): IReverseCallClient<FilterRegistrationResponse> {
        return new ReverseCallClient<PublicFilterClientToRuntimeMessage, FilterRuntimeToClientMessage, PublicFilterRegistrationRequest, FilterRegistrationResponse, FilterEventRequest, PartitionedFilterResponse> (
            (requests, cancellation) => reactiveDuplex(client, client.connectPublic, requests, cancellation),
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
            executionContext,
            registerArguments,
            pingInterval,
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
