// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { Guid } from '@dolittle/rudiments';
import { IEventTypes } from '@dolittle/sdk.artifacts';
import { EventContext, ScopeId } from '@dolittle/sdk.events';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { guids } from '@dolittle/sdk.protobuf';
import { Cancellation } from '@dolittle/sdk.resilience';
import { IReverseCallClient, ReverseCallClient, reactiveDuplex } from '@dolittle/sdk.services';

import { FiltersClient } from '@dolittle/runtime.contracts/Runtime/Events.Processing/Filters_grpc_pb';
import { FilterRegistrationRequest, FilterEventRequest, FilterResponse, FilterRegistrationResponse, FilterRuntimeToClientMessage, FilterClientToRuntimeMessage } from '@dolittle/runtime.contracts/Runtime/Events.Processing/Filters_pb';
import { ProcessorFailure } from '@dolittle/runtime.contracts/Runtime/Events.Processing/Processors_pb';

import { FilterId, FilterEventCallback } from '../index';
import { FilterEventProcessor } from './FilterEventProcessor';

export class EventFilterProcessor extends FilterEventProcessor<FilterRegistrationRequest, FilterResponse> {

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

    protected get registerArguments(): FilterRegistrationRequest {
        const registerArguments = new FilterRegistrationRequest();
        registerArguments.setFilterid(guids.toProtobuf(this._identifier.value));
        registerArguments.setScopeid(guids.toProtobuf(this._scopeId.value));
        return registerArguments;
    }

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

    protected createResponseFromFailure(failure: ProcessorFailure): FilterResponse {
        const response = new FilterResponse();
        response.setFailure(failure);
        return response;
    }

    protected async filter(event: any, context: EventContext): Promise<FilterResponse> {
        const shouldInclude = await this._callback(event, context);

        const response = new FilterResponse();
        response.setIsincluded(shouldInclude);
        return response;
    }
}
