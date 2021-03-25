// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { EventProcessor } from '@dolittle/sdk.events.processing';
import { ExecutionContext } from '@dolittle/sdk.execution';

import {
    ProjectionRegistrationRequest,
    ProjectionRegistrationResponse,
    ProjectionClientToRuntimeMessage,
    ProjectionRuntimeToClientMessage,
    ProjectionRequest,
    ProjectionResponse
} from '@dolittle/runtime.contracts/Runtime/Events.Processing/Projections_pb';
import { ProjectionsClient } from '@dolittle/runtime.contracts/Runtime/Events.Processing/Projections_grpc_pb';
import { Failure } from '@dolittle/runtime.contracts/Fundamentals/Protobuf/Failure_pb';
import { RetryProcessingState, ProcessorFailure } from '@dolittle/runtime.contracts/Runtime/Events.Processing/Processors_pb';

import { ProjectionId } from '../ProjectionId';
import { Cancellation } from '@dolittle/sdk.resilience';
import { IReverseCallClient, reactiveDuplex, ReverseCallClient } from '@dolittle/sdk.services';

export class ProjectionProcessor extends EventProcessor<ProjectionId, ProjectionRegistrationRequest, ProjectionRegistrationResponse, ProjectionRequest, ProjectionResponse> {


    constructor(
        private _client: ProjectionsClient,
        private _executionContext: ExecutionContext,
        logger: Logger
    ) {
        super('Projection', ProjectionId.from(''), logger);
    }

    protected get registerArguments(): ProjectionRegistrationRequest {
        const registerArguments = new ProjectionRegistrationRequest();
        registerArguments.setProjectionid();
        registerArguments.setScopeid();
        registerArguments.setInitialstate('{}');

        registerArguments.setEventsList([]);
        return registerArguments;
    }

    protected createClient(
        registerArguments: ProjectionRegistrationRequest,
        callback: (request: ProjectionRequest, executionContext: ExecutionContext) => Promise<ProjectionResponse>,
        pingTimeout: number,
        cancellation: Cancellation): IReverseCallClient<ProjectionRegistrationResponse> {
        return new ReverseCallClient<ProjectionClientToRuntimeMessage, ProjectionRuntimeToClientMessage, ProjectionRegistrationRequest, ProjectionRegistrationResponse, ProjectionRequest, ProjectionResponse> (
            (requests, cancellation) => reactiveDuplex(this._client, this._client.connect, requests, cancellation),
            ProjectionClientToRuntimeMessage,
            (message, connectArguments) => message.setRegistrationrequest(connectArguments),
            (message) => message.getRegistrationresponse(),
            (message) => message.getHandlerequest(),
            (message, response) => message.setHandleresult(response),
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

    protected getFailureFromRegisterResponse(response: ProjectionRegistrationResponse): Failure | undefined {
        return response.getFailure();
    }

    protected getRetryProcessingStateFromRequest(request: ProjectionRequest): RetryProcessingState | undefined {
        return request.getRetryprocessingstate();
    }

    protected createResponseFromFailure(failure: ProcessorFailure): ProjectionResponse {
        const response = new ProjectionResponse();
        response.setFailure(failure);
        return response;
    }

    protected async handle(request: ProjectionRequest, executionContext: ExecutionContext): Promise<ProjectionResponse> {

        return new ProjectionResponse();
    }
}