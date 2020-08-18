// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { Guid } from '@dolittle/rudiments';
import { IArtifacts } from '@dolittle/sdk.artifacts';
import { EventContext, ScopeId } from '@dolittle/sdk.events';
import { IExecutionContextManager } from '@dolittle/sdk.execution';
import { guids } from '@dolittle/sdk.protobuf';
import { Cancellation } from '@dolittle/sdk.resilience';
import { IReverseCallClient, ReverseCallClient, reactiveDuplex } from '@dolittle/sdk.services';

import { FiltersClient } from '@dolittle/runtime.contracts/Runtime/Events.Processing/Filters_grpc_pb';
import { FilterRegistrationRequest, FilterEventRequest, FilterRegistrationResponse, FilterRuntimeToClientMessage } from '@dolittle/runtime.contracts/Runtime/Events.Processing/Filters_pb';
import { PartitionedFilterClientToRuntimeMessage, PartitionedFilterRegistrationRequest, PartitionedFilterResponse } from '@dolittle/runtime.contracts/Runtime/Events.Processing/PartitionedFilters_pb';
import { ProcessorFailure } from '@dolittle/runtime.contracts/Runtime/Events.Processing/Processors_pb';

import { FilterEventProcessor } from './FilterEventProcessor';
import { FilterId } from '../FilterId';
import { PartitionedFilterEventCallback } from '../PartitionedFilterEventCallback';

export class PartitionedEventFilterProcessor extends FilterEventProcessor<PartitionedFilterRegistrationRequest, PartitionedFilterResponse> {

    constructor(
        filterId: FilterId,
        private _scopeId: ScopeId,
        private _callback: PartitionedFilterEventCallback,
        private _client: FiltersClient,
        private _executionContextManager: IExecutionContextManager,
        artifacts: IArtifacts,
        logger: Logger
    ) {
        super('Partitioned Filter', filterId, artifacts, logger);
    }

    protected get registerArguments(): PartitionedFilterRegistrationRequest {
        const registerArguments = new PartitionedFilterRegistrationRequest();
        registerArguments.setFilterid(guids.toProtobuf(Guid.as(this._identifier)));
        registerArguments.setScopeid(guids.toProtobuf(Guid.as(this._scopeId)));
        return registerArguments;
    }

    protected createClient(registerArguments: PartitionedFilterRegistrationRequest, callback: (request: FilterEventRequest) => Promise<PartitionedFilterResponse>, pingTimeout: number, cancellation: Cancellation): IReverseCallClient<FilterRegistrationResponse> {
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

    protected async filter(event: any, context: EventContext): Promise<PartitionedFilterResponse> {
        const result = await this._callback(event, context);

        const response = new PartitionedFilterResponse();
        response.setIsincluded(result.shouldInclude);
        response.setPartitionid(guids.toProtobuf(Guid.as(result.partitionId)));
        return response;
    }
}
