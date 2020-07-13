// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IExecutionContextManager, MicroserviceId, Version, ExecutionContextManager } from '@dolittle/sdk.execution';
import { IArtifacts, ArtifactsBuilder } from '@dolittle/sdk.artifacts';
import { IEventStore, EventStore } from '@dolittle/sdk.events';
import { EventStoreClient } from '@dolittle/runtime.contracts/Runtime/Events/EventStore_grpc_pb';
import { IEventHandlers, EventHandlersBuilder, EventHandlersBuilderCallback } from '@dolittle/sdk.events.handling';
import grpc from 'grpc';

import '@dolittle/sdk.protobuf';
import { Guid } from '@dolittle/rudiments';
import winston, { Logger, LoggerOptions } from 'winston';


export type LoggingConfigurationCallback = (options: LoggerOptions) => void;

/**
 * Represents the client for working with the Dolittle Runtime
 */
export class Client {

    /**
     * Creates an instance of client.
     * @param {Logger} logger Winston Logger for logging.
     * @param {IExecutionContextManager} executionContextManager The execution context manager.
     * @param {IArtifacts} artifacts All the configured artifacts.
     * @param {IEventStore} eventStore The event store to work with.
     */
    constructor(
        readonly logger: Logger,
        readonly executionContextManager: IExecutionContextManager,
        readonly artifacts: IArtifacts,
        readonly eventStore: IEventStore,
        readonly eventHandlers: IEventHandlers) {
        this.executionContextManager = executionContextManager;
        this.artifacts = artifacts;
        this.eventStore = eventStore;
        this.eventHandlers = eventHandlers;
    }

    /**
     * Create a default builder - not specifically targeting a Microservice.
     * @param {Version} [version] Optional version of the software.
     * @param {string} [environment] The environment the software is running in. (e.g. development, production).
     * @returns {ClientBuilder} The builder to build a {Client} from.
     */
    static default(microserviceId: MicroserviceId = Guid.empty, version: Version = Version.first, environment?: string): Client {
        return Client.for(microserviceId, version, environment).build();
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
            environment = process.env.NODE_ENV;
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
    private _loggerOptions: LoggerOptions;
    private _artifactsBuilder: ArtifactsBuilder;
    private _eventHandlersBuilder: EventHandlersBuilder;

    /**
     * Creates an instance of client builder.
     * @param {MicroserviceId} microserviceId The unique identifier of the microservice.
     * @param {Version} version The version of the currently running software.
     * @param {string} environment The environment the software is running in. (e.g. development, production).
     */
    constructor(microserviceId: MicroserviceId, version: Version, environment: string) {
        this._microserviceId = Guid.as(microserviceId);
        this._version = version;
        this._environment = environment;
        this._artifactsBuilder = new ArtifactsBuilder();
        this._eventHandlersBuilder = new EventHandlersBuilder();
        this._loggerOptions = {
            level: 'info',
            format: winston.format.prettyPrint(),
            defaultMeta: {
                microserviceId: this._microserviceId.toString()
            },
            transports: [
                new winston.transports.Console({
                    format: winston.format.prettyPrint()
                })
            ]
        };
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
     * Configure event handlers through the event handlers builder.
     * @param {EventHandlersBuilderCallback} callback The builder callback.
     * @returns {ClientBuilder} The client builder for continuation.
     */
    withEventHandlers(callback: EventHandlersBuilderCallback): ClientBuilder {
        callback(this._eventHandlersBuilder);
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
     * Configures logging for the SDK
     * @param {LoggingConfigurationCallback} callback Callback for setting Winston {LoggerOptions}.
     */
    configureLogging(callback: LoggingConfigurationCallback) {

        callback(this._loggerOptions);
    }

    /**
     * Build the {Client}.
     * @returns {Client}
     */
    build(): Client {
        const logger = winston.createLogger(this._loggerOptions);
        const executionContextManager = new ExecutionContextManager(this._microserviceId, this._version, this._environment);
        const artifacts = this._artifactsBuilder.build();
        const eventHandlers = this._eventHandlersBuilder.build();
        return new Client(
            logger,
            executionContextManager,
            artifacts,
            new EventStore(
                new EventStoreClient(`${this._host}:${this._port}`, grpc.credentials.createInsecure()),
                artifacts,
                executionContextManager,
                logger),
            eventHandlers
        );
    }
}
