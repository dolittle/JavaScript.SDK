// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { EventContext, IEventTypes, ScopeId } from '@dolittle/sdk.events';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { Cancellation } from '@dolittle/sdk.resilience';
import { IReverseCallClient, ReverseCallClient, reactiveDuplex } from '@dolittle/sdk.services';

import { FiltersClient } from '@dolittle/runtime.contracts/Events.Processing/Filters_grpc_pb';
import { FilterRegistrationRequest, FilterEventRequest, FilterResponse, FilterRegistrationResponse, FilterRuntimeToClientMessage, FilterClientToRuntimeMessage } from '@dolittle/runtime.contracts/Events.Processing/Filters_pb';
import { ProcessorFailure } from '@dolittle/runtime.contracts/Events.Processing/Processors_pb';

import { FilterId, FilterEventCallback } from '..';
import { FilterEventProcessor } from './FilterEventProcessor';

import '@dolittle/sdk.protobuf';

/**
 * Represents an implementation of {@link FilterEventProcessor} that filters events to an unpartitioned stream.
 */
export class EventFilterProcessor extends FilterEventProcessor<FilterRegistrationRequest, FilterResponse> {

    /**
     * Initialises a new instance of the {@link EventFilterProcessor} class.
     * @param {FilterId} filterId - The filter id.
     * @param {ScopeId} _scopeId - The filter scope id.
     * @param {FilterEventCallback} _callback - The filter callback.
     * @param {FiltersClient} _client - The filters client to use to register the filter.
     * @param {ExecutionContext} _executionContext - The execution context of the client.
     * @param {IEventTypes} eventTypes - All registered event types.
     * @param {Logger} logger - The logger to use for logging.
     */
    constructor(
        filterId: FilterId,
        private _scopeId: ScopeId,
        private _callback: FilterEventCallback,
        private _client: FiltersClient,
        private _executionContext: ExecutionContext,
        eventTypes: IEventTypes,
        logger: Logger
    ) {
        super('Filter', filterId, eventTypes, logger);
    }

    /** @inheritdoc */
    protected get registerArguments(): FilterRegistrationRequest {
        const registerArguments = new FilterRegistrationRequest();
        registerArguments.setFilterid(this._identifier.value.toProtobuf());
        registerArguments.setScopeid(this._scopeId.value.toProtobuf());
        return registerArguments;
    }

    /** @inheritdoc */
    protected createClient(
        registerArguments: FilterRegistrationRequest,
        callback: (request: FilterEventRequest, executionContext: ExecutionContext) => Promise<FilterResponse>,
        pingTimeout: number,
        cancellation: Cancellation): IReverseCallClient<FilterRegistrationResponse> {
        return new ReverseCallClient<FilterClientToRuntimeMessage, FilterRuntimeToClientMessage, FilterRegistrationRequest, FilterRegistrationResponse, FilterEventRequest, FilterResponse> (
            (requests, cancellation) => reactiveDuplex(this._client, this._client.connect, requests, cancellation),
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
            this._executionContext,
            registerArguments,
            pingTimeout,
            callback,
            cancellation,
            this._logger
        );
    }

    /** @inheritdoc */
    protected createResponseFromFailure(failure: ProcessorFailure): FilterResponse {
        const response = new FilterResponse();
        response.setFailure(failure);
        return response;
    }

    /** @inheritdoc */
    protected async filter(event: any, context: EventContext): Promise<FilterResponse> {
        const shouldInclude = await this._callback(event, context);

        const response = new FilterResponse();
        response.setIsincluded(shouldInclude);
        return response;
    }
}
