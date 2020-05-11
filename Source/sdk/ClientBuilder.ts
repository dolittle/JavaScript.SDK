// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Client } from './Client';
import { ArtifactsBuilder, Artifact } from '@dolittle/sdk.artifacts';
import { MicroserviceId, ExecutionContextManager, Version } from '@dolittle/sdk.execution';
import { EventStore } from '@dolittle/sdk.events';
import { EventStoreClient } from '@dolittle/runtime.contracts/Runtime/Events/EventStore_grpc_pb';
import grpc from 'grpc';

export type ArtifactsBuilderCallback = (builder: ArtifactsBuilder) => void;

export class ClientBuilder {
    private _microserviceId: MicroserviceId;
    private _host = 'localhost';
    private _port = 50053;
    private _version: Version;
    private _environment: string;

    private _artifactsBuilder: ArtifactsBuilder = new ArtifactsBuilder();

    constructor(microserviceId: MicroserviceId, version: Version, environment: string) {
        this._microserviceId = microserviceId;
        this._version = version;
        this._environment = environment;
        this._artifactsBuilder = new ArtifactsBuilder();
    }

    static for(microserviceId: MicroserviceId, version: Version = Version.first, environment?: string): ClientBuilder {
        if (!environment) {
            environment = process.env['NODE_ENV'];
            if (!environment || environment === '') {
                environment = 'development';
            }
        }

        const builder = new ClientBuilder(microserviceId, version, environment);
        return builder;
    }

    artifacts(callback: ArtifactsBuilderCallback): ClientBuilder {
        callback(this._artifactsBuilder);
        return this;
    }

    connectTo(host: string, port: number): ClientBuilder {
        this._host = host;
        this._port = port;
        return this;
    }

    build(): Client {
        const executionContextManager = new ExecutionContextManager(this._microserviceId, this._version, this._environment);
        const artifacts = this._artifactsBuilder.build();
        return new Client(
            executionContextManager,
            artifacts,
            new EventStore(
                new EventStoreClient(`${this._host}:${this._port}`, grpc.credentials.createInsecure()),
                artifacts,
                executionContextManager)
        );
    }
}
