// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IEventStore } from '@dolittle/sdk.events';
import { IExecutionContextManager, MicroserviceId, Version, ExecutionContextManager } from '@dolittle/sdk.execution';
import { IArtifacts } from '@dolittle/sdk.artifacts';
import { ArtifactsBuilder, Artifact } from '@dolittle/sdk.artifacts';
import { EventStore } from '@dolittle/sdk.events';
import { EventStoreClient } from '@dolittle/runtime.contracts/Runtime/Events/EventStore_grpc_pb';
import grpc from 'grpc';

import '@dolittle/sdk.protobuf';

/**
 * Represents the client for working with the Dolittle Runtime
 */
export class Client {
    readonly executionContextManager: IExecutionContextManager;
    readonly artifacts: IArtifacts;
    readonly eventStore: IEventStore;

    /**
     * Creates an instance of client.
     * @param {IExecutionContextManager} executionContextManager The execution context manager.
     * @param {IArtifacts} artifacts All the configured artifacts.
     * @param {IEventStore} eventStore The eventstore to work with.
     */
    constructor(executionContextManager: IExecutionContextManager, artifacts: IArtifacts, eventStore: IEventStore) {
        this.executionContextManager = executionContextManager;
        this.artifacts = artifacts;
        this.eventStore = eventStore;
    }

    /**
     * Create a default builder - not specifically targetting a Microservice.
     * @param {Version} [version] Optional version of the software.
     * @param {string} [environment] The environment the software is running in. (e.g. development, production).
     * @returns {ClientBuilder} The builder to build a {Client} from.
     */
    static default(version: Version = Version.first, environment?: string): ClientBuilder {
        return Client.for(MicroserviceId.empty, version, environment);
    }

    /**
     * Create a client builder for a Microservice
     * @param {MicroserviceId} microserviceId The unique identifier for the microservice.
     * @param {Version} [version] Optional version of the software.
     * @param {string} [environment] The environment the software is running in. (e.g. development, production).
     * @returns {ClientBuilder} The builder to build a {Client} from.
     */
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
}

export type ArtifactsBuilderCallback = (builder: ArtifactsBuilder) => void;

/**
 * Represents a builder for building {Client}.
 */
export class ClientBuilder {
    private _microserviceId: MicroserviceId;
    private _host = 'localhost';
    private _port = 50053;
    private _version: Version;
    private _environment: string;

    private _artifactsBuilder: ArtifactsBuilder = new ArtifactsBuilder();

    /**
     * Creates an instance of client builder.
     * @param {MicroserviceId} microserviceId The unique identifier of the microservice.
     * @param {Version} version The version of the currently running software.
     * @param {string} environment The environment the software is running in. (e.g. development, production).
     */
    constructor(microserviceId: MicroserviceId, version: Version, environment: string) {
        this._microserviceId = microserviceId;
        this._version = version;
        this._environment = environment;
        this._artifactsBuilder = new ArtifactsBuilder();
    }

    /**
     * Configure artifacts through the artifacts builder.
     * @param {ArtifactsBuilderCallback} callback The builder callback.
     * @returns {ClientBuilder} The client builder for continuation.
     */
    artifacts(callback: ArtifactsBuilderCallback): ClientBuilder {
        callback(this._artifactsBuilder);
        return this;
    }

    /**
     * Connect to a specific host and port for the Dolittle runtime.
     * @param {string} host The host name to connect to.
     * @param {number} port The port to connect to.
     * @returns {ClientBuilder} The client builder for continuation.
     * @summary If not used, the default host of 'localhost' and port 50053 will be used.
     */
    connectTo(host: string, port: number): ClientBuilder {
        this._host = host;
        this._port = port;
        return this;
    }

    /**
     * Build the {Client}.
     * @returns {Client}
     */
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
