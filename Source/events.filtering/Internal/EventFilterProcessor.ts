// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { IServiceProvider } from '@dolittle/sdk.dependencyinversion';
import { EventContext, IEventTypes, ScopeId } from '@dolittle/sdk.events';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { Guids } from '@dolittle/sdk.protobuf';
import { Cancellation } from '@dolittle/sdk.resilience';
import { IReverseCallClient, ReverseCallClient, reactiveDuplex } from '@dolittle/sdk.services';

import { FiltersClient } from '@dolittle/runtime.contracts/Events.Processing/Filters_grpc_pb';
import { FilterRegistrationRequest, FilterEventRequest, FilterResponse, FilterRegistrationResponse, FilterRuntimeToClientMessage, FilterClientToRuntimeMessage } from '@dolittle/runtime.contracts/Events.Processing/Filters_pb';
import { ProcessorFailure } from '@dolittle/runtime.contracts/Events.Processing/Processors_pb';

import { FilterEventCallback } from '../FilterEventCallback';
import { FilterId } from '../FilterId';
import { FilterEventProcessor } from './FilterEventProcessor';

/**
 * Represents an implementation of {@link FilterEventProcessor} that filters events to an unpartitioned stream.
 */
export class EventFilterProcessor extends FilterEventProcessor<FilterRegistrationRequest, FilterResponse> {

    /**
     * Initialises a new instance of the {@link EventFilterProcessor} class.
     * @param {FilterId} filterId - The filter id.
     * @param {ScopeId} _scopeId - The filter scope id.
     * @param {FilterEventCallback} _callback - The filter callback.
     * @param {IEventTypes} eventTypes - All registered event types.
     */
    constructor(
        filterId: FilterId,
        private _scopeId: ScopeId,
        private _callback: FilterEventCallback,
        eventTypes: IEventTypes,
    ) {
        super('Filter', filterId, eventTypes);
    }

    /** @inheritdoc */
    protected get registerArguments(): FilterRegistrationRequest {
        const registerArguments = new FilterRegistrationRequest();
        registerArguments.setFilterid(Guids.toProtobuf(this._identifier.value));
        registerArguments.setScopeid(Guids.toProtobuf(this._scopeId.value));
        return registerArguments;
    }

    /** @inheritdoc */
    protected createClient(
        client: FiltersClient,
        registerArguments: FilterRegistrationRequest,
        callback: (request: FilterEventRequest, executionContext: ExecutionContext) => Promise<FilterResponse>,
        executionContext: ExecutionContext,
        pingInterval: number,
        logger: Logger,
        cancellation: Cancellation
    ): IReverseCallClient<FilterRegistrationResponse> {
        return new ReverseCallClient<FilterClientToRuntimeMessage, FilterRuntimeToClientMessage, FilterRegistrationRequest, FilterRegistrationResponse, FilterEventRequest, FilterResponse> (
            (requests, cancellation) => reactiveDuplex(client, client.connect, requests, cancellation),
            FilterClientToRuntimeMessage,
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
    protected createResponseFromFailure(failure: ProcessorFailure): FilterResponse {
        const response = new FilterResponse();
        response.setFailure(failure);
        return response;
    }

    /** @inheritdoc */
    protected async filter(event: any, context: EventContext, services: IServiceProvider, logger: Logger): Promise<FilterResponse> {
        const shouldInclude = await this._callback(event, context);

        const response = new FilterResponse();
        response.setIsincluded(shouldInclude);
        return response;
    }
}
