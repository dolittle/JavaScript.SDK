// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { Guid } from '@dolittle/rudiments';
import { IArtifacts } from '@dolittle/sdk.artifacts';
import { EventContext } from '@dolittle/sdk.events';
import { IExecutionContextManager } from '@dolittle/sdk.execution';
import { guids } from '@dolittle/sdk.protobuf';
import { Cancellation, IReverseCallClient, ReverseCallClient, reactiveDuplex } from '@dolittle/sdk.services';

import { FiltersClient } from '@dolittle/runtime.contracts/Runtime/Events.Processing/Filters_grpc_pb';
import { FilterEventRequest, FilterRegistrationResponse, FilterRuntimeToClientMessage } from '@dolittle/runtime.contracts/Runtime/Events.Processing/Filters_pb';
import { PartitionedFilterResponse } from '@dolittle/runtime.contracts/Runtime/Events.Processing/PartitionedFilters_pb';
import { PublicFilterClientToRuntimeMessage, PublicFilterRegistrationRequest } from '@dolittle/runtime.contracts/Runtime/Events.Processing/PublicFilters_pb';
import { ProcessorFailure } from '@dolittle/runtime.contracts/Runtime/Events.Processing/Processors_pb';

import { FilterEventProcessor } from './FilterEventProcessor';
import { FilterId } from '../FilterId';
import { PartitionedFilterEventCallback } from '../PartitionedFilterEventCallback';

export class PublicEventFilterProcessor extends FilterEventProcessor<PublicFilterRegistrationRequest, PartitionedFilterResponse> {

    constructor(
        filterId: FilterId,
        private _callback: PartitionedFilterEventCallback,
        private _client: FiltersClient,
        private _executionContextManager: IExecutionContextManager,
        artifacts: IArtifacts,
        logger: Logger
    ) {
        super('Public Filter', filterId, artifacts, logger);
    }

    protected get registerArguments(): PublicFilterRegistrationRequest {
        const registerArguments = new PublicFilterRegistrationRequest();
        registerArguments.setFilterid(guids.toProtobuf(Guid.as(this._identifier)));
        return registerArguments;
    }

    protected createClient(registerArguments: PublicFilterRegistrationRequest, callback: (request: FilterEventRequest) => PartitionedFilterResponse, pingTimeout: number, cancellation: Cancellation): IReverseCallClient<FilterRegistrationResponse> {
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
            this._executionContextManager,
            registerArguments,
            pingTimeout,
            callback,
            cancellation,
            this._logger
        );
    }

    protected createResponseFromFailure(failure: ProcessorFailure): PartitionedFilterResponse {
        const response = new PartitionedFilterResponse();
        response.setFailure(failure);
        return response;
    }

    protected filter(event: any, context: EventContext): PartitionedFilterResponse {
        const result = this._callback(event, context);

        const response = new PartitionedFilterResponse();
        response.setIsincluded(result.shouldInclude);
        response.setPartitionid(guids.toProtobuf(Guid.as(result.partitionId)));
        return response;
    }
}
