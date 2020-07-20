// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IExecutionContextManager, MicroserviceId, Version, ExecutionContextManager } from '@dolittle/sdk.execution';
import { IArtifacts, ArtifactsBuilder } from '@dolittle/sdk.artifacts';
import { IEventStore, EventStore } from '@dolittle/sdk.events';
import { EventStoreClient } from '@dolittle/runtime.contracts/Runtime/Events/EventStore_grpc_pb';
import { IEventHandlers, EventHandlersBuilder, EventHandlersBuilderCallback } from '@dolittle/sdk.events.handling';
import { IFilters, EventFiltersBuilder, EventFiltersBuilderCallback } from '@dolittle/sdk.events.filtering';
import { EventHandlersClient } from '@dolittle/runtime.contracts/Runtime/Events.Processing/EventHandlers_grpc_pb';
import { FiltersClient } from '@dolittle/runtime.contracts/Runtime/Events.Processing/Filters_grpc_pb';
import grpc from 'grpc';
import { Logger, LoggerOptions, DefaulLevels, format, transports, createLogger } from 'winston';

import { Guid } from '@dolittle/rudiments';
import { Cancellation } from '@dolittle/sdk.services';


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
        readonly eventHandlers: IEventHandlers,
        readonly filters: IFilters) {
        this.executionContextManager = executionContextManager;
        this.artifacts = artifacts;
        this.eventStore = eventStore;
        this.eventHandlers = eventHandlers;
        this.filters = filters;
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
    private _loggerOptions: LoggerOptions<DefaulLevels>;
    private _artifactsBuilder: ArtifactsBuilder;
    private _eventHandlersBuilder: EventHandlersBuilder;
    private _eventFiltersBuilder: EventFiltersBuilder;
    private _cancellation: Cancellation;

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
        this._eventFiltersBuilder = new EventFiltersBuilder();
        this._cancellation = Cancellation.default;
        this._loggerOptions = {
            level: 'info',
            format: format.prettyPrint(),
            defaultMeta: {
                microserviceId: this._microserviceId.toString()
            },
            transports: [
                new transports.Console({
                    format: format.prettyPrint()
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
     * Configure event filters through the event filters builder.
     * @param {EventFiltersBuilderCallback} callback The builder callback.
     * @returns {ClientBuilder} The client builder for continuation.
     */
    withFilters(callback: EventFiltersBuilderCallback): ClientBuilder {
        callback(this._eventFiltersBuilder);
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
    configureLogging(callback: LoggingConfigurationCallback): ClientBuilder {
        callback(this._loggerOptions);
        return this;
    }

    /**
     * Configures cancellation for closing open connections to the Runtime.
     * @param {Cancellation} cancellation The cancellation that will be passed to Filters and Event Handlers.
     */
    withCancellation(cancellation: Cancellation): ClientBuilder {
        this._cancellation = cancellation;
        return this;
    }

    /**
     * Build the {Client}.
     * @returns {Client}
     */
    build(): Client {
        const logger = createLogger(this._loggerOptions);
        const executionContextManager = new ExecutionContextManager(this._microserviceId, this._version, this._environment);
        const artifacts = this._artifactsBuilder.build();

        const connectionString = `${this._host}:${this._port}`;
        const credentials = grpc.credentials.createInsecure();

        const eventHandlersClient = new EventHandlersClient(connectionString, credentials);
        const eventHandlers = this._eventHandlersBuilder.build(
            eventHandlersClient,
            executionContextManager,
            artifacts,
            logger,
            this._cancellation
        );

        const filtersClient = new FiltersClient(connectionString, credentials);
        const filters = this._eventFiltersBuilder.build(
            filtersClient,
            executionContextManager,
            artifacts,
            logger,
            this._cancellation
        );

        return new Client(
            logger,
            executionContextManager,
            artifacts,
            new EventStore(
                new EventStoreClient(connectionString, credentials),
                artifacts,
                executionContextManager,
                logger),
            eventHandlers,
            filters
        );
    }
}
