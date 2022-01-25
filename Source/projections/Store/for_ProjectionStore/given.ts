// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ClientReadableStream, ClientUnaryCall, InterceptingCall, ServiceError } from '@grpc/grpc-js';
import { EventEmitter } from 'stream';
import sinon, { stubInterface } from 'ts-sinon';
import { Logger } from 'winston';

import { Claims, CorrelationId, Environment, ExecutionContext, MicroserviceId, TenantId, Version } from '@dolittle/sdk.execution';

import { ProjectionsClient } from '@dolittle/runtime.contracts/Projections/Store_grpc_pb';
import { GetAllResponse, GetOneResponse } from '@dolittle/runtime.contracts/Projections/Store_pb';

import { IProjectionReadModelTypes } from '../IProjectionReadModelTypes';
import { ProjectionReadModelTypes } from '../ProjectionReadModelTypes';

export default {
    get an_execution_context(): ExecutionContext {
        return new ExecutionContext(
            MicroserviceId.notApplicable,
            TenantId.unknown,
            Version.notSet,
            Environment.undetermined,
            CorrelationId.system,
            Claims.empty,
        );
    },

    get a_logger(): Logger {
        return stubInterface<Logger>();
    },

    get empty_read_model_types(): IProjectionReadModelTypes {
        return new ProjectionReadModelTypes();
    },

    projections_client_with_get_one_response(response?: GetOneResponse, error?: ServiceError): ProjectionsClient {
        const projections_client = stubInterface<ProjectionsClient>();

        projections_client.getOne.callsFake((_, __, ___, callback) => {
            setTimeout(() => callback(error ?? null, response as any), 0);
            return new EventEmitter() as ClientUnaryCall;
        });

        return projections_client;
    },

    get projections_client_and_get_all_stream(): [ProjectionsClient, ClientReadableStream<GetAllResponse>] {
        const getAllStream = new EventEmitter() as ClientReadableStream<GetAllResponse>;

        const projectionsClient = stubInterface<ProjectionsClient>({
            getAllInBatches: getAllStream,
        });

        return [projectionsClient, getAllStream];
    },
};
