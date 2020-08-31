// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import grpc from 'grpc';
import { Logger, LoggerOptions, DefaulLevels, format, transports, createLogger } from 'winston';

import { IArtifacts, ArtifactsBuilder } from '@dolittle/sdk.artifacts';
import { IContainer, Container } from '@dolittle/sdk.common';
import { IEventStore, EventStore } from '@dolittle/sdk.events';
import { IFilters, EventFiltersBuilder, EventFiltersBuilderCallback } from '@dolittle/sdk.events.filtering';
import { IEventHandlers, EventHandlersBuilder, EventHandlersBuilderCallback } from '@dolittle/sdk.events.handling';
import { IExecutionContextManager, MicroserviceId, Version, ExecutionContextManager, Environment } from '@dolittle/sdk.execution';
import { EventHorizonsBuilder, EventHorizonsBuilderCallback, IEventHorizons } from '@dolittle/sdk.eventhorizon';
import { Cancellation } from '@dolittle/sdk.resilience';
import { Guid } from '@dolittle/rudiments';

import { EventStoreClient } from '@dolittle/runtime.contracts/Runtime/Events/EventStore_grpc_pb';
import { EventHandlersClient } from '@dolittle/runtime.contracts/Runtime/Events.Processing/EventHandlers_grpc_pb';
import { FiltersClient } from '@dolittle/runtime.contracts/Runtime/Events.Processing/Filters_grpc_pb';
import { SubscriptionsClient } from '@dolittle/runtime.contracts/Runtime/EventHorizon/Subscriptions_grpc_pb';

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
     * @param {IEventHandlers} eventHandlers All the event handlers.
     * @param {IFilters} filters All the filters.
     * @param {IEventHorizons} eventHorizons All event horizons.
     */
    constructor(
        readonly logger: Logger,
        readonly executionContextManager: IExecutionContextManager,
        readonly artifacts: IArtifacts,
        readonly eventStore: IEventStore,
        readonly eventHandlers: IEventHandlers,
        readonly filters: IFilters,
        readonly eventHorizons: IEventHorizons) {
    }

    /**
     * Create a default builder - not specifically targeting a Microservice.
     * @param {Guid | string} [microserviceId] Optional microservice id.
     * @param {Version} [version] Optional version of the software.
     * @param {string} [environment] The environment the software is running in. (e.g. development, production).
     * @returns {ClientBuilder} The builder to build a {Client} from.
     */
    static default(
        microserviceId?: Guid | string,
        version?: Version,
        environment?: string): Client {
        return Client.forMicroservice(microserviceId || MicroserviceId.notApplicable.value, version, environment).build();
    }

    /**
     * Create a client builder for a Microservice
     * @param {Guid | string} microserviceId The unique identifier for the microservice.
     * @param {Version} [version] Optional version of the software.
     * @param {string} [environment] The environment the software is running in. (e.g. development, production).
     * @returns {ClientBuilder} The builder to build a {Client} from.
     */
    static forMicroservice(microserviceId: Guid | string, version: Version = Version.first, environment?: string): ClientBuilder {
        if (!environment) {
            environment = process.env.NODE_ENV;
            if (!environment || environment === '') {
                environment = Environment.development.value;
            }
        }

        const builder = new ClientBuilder(MicroserviceId.from(microserviceId), version, Environment.from(environment));
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
    private _environment: Environment;
    private _loggerOptions: LoggerOptions<DefaulLevels>;
    private _artifactsBuilder: ArtifactsBuilder;
    private _eventHandlersBuilder: EventHandlersBuilder;
    private _eventFiltersBuilder: EventFiltersBuilder;
    private _eventHorizonsBuilder: EventHorizonsBuilder;
    private _cancellation: Cancellation;
    private _container: IContainer = new Container();

    /**
     * Creates an instance of client builder.
     * @param {MicroserviceId} microserviceId The unique identifier of the microservice.
     * @param {Version} version The version of the currently running software.
     * @param {Environment} environment The environment the software is running in. (e.g. development, production).
     */
    constructor(microserviceId: MicroserviceId, version: Version, environment: Environment) {
        this._microserviceId = microserviceId;
        this._version = version;
        this._environment = environment;
        this._artifactsBuilder = new ArtifactsBuilder();
        this._eventHandlersBuilder = new EventHandlersBuilder();
        this._eventFiltersBuilder = new EventFiltersBuilder();
        this._eventHorizonsBuilder = new EventHorizonsBuilder();
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
     * Configure event horizons and any subscriptions.
     * @param {EventHorizonsBuilderCallback} callback The builder callback.
     * @returns {ClientBuilder} The client builder for continuation.
     */
    withEventHorizons(callback: EventHorizonsBuilderCallback): ClientBuilder {
        callback(this._eventHorizonsBuilder);
        return this;
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
     * @returns {ClientBuilder}
     */
    configureLogging(callback: LoggingConfigurationCallback): ClientBuilder {
        callback(this._loggerOptions);
        return this;
    }

    /**
     * Configures cancellation for closing open connections to the Runtime.
     * @param {Cancellation} cancellation The cancellation that will be passed to Filters and Event Handlers.
     * @returns {ClientBuilder}
     */
    withCancellation(cancellation: Cancellation): ClientBuilder {
        this._cancellation = cancellation;
        return this;
    }

    /**
     * Use a specific IoC container for creating instances of types.
     * @param {IContainer} container Container
     * @returns {ClientBuilder}
     */
    useContainer(container: IContainer): ClientBuilder {
        this._container = container;
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
            this._container,
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


        const subscriptionsClient = new SubscriptionsClient(connectionString, credentials);
        const eventHorizons = this._eventHorizonsBuilder.build(subscriptionsClient, executionContextManager, logger);

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
            filters,
            eventHorizons
        );
    }
}
