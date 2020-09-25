// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import grpc from 'grpc';
import { Logger} from 'winston';

import { IArtifacts } from '@dolittle/sdk.artifacts';
import { IContainer, Container } from '@dolittle/sdk.common';
import { IEventStore, EventStore, EventStoreBuilderCallback, EventStoreBuilder } from '@dolittle/sdk.events';
import { IFilters } from '@dolittle/sdk.events.filtering';
import { IEventHandlers } from '@dolittle/sdk.events.handling';
import { IExecutionContextManager, MicroserviceId, ExecutionContextManager, Environment, MicroserviceBuilder, MicroserviceBuilderCallback } from '@dolittle/sdk.execution';
import { EventHorizonsBuilder, EventHorizonsBuilderCallback, IEventHorizons } from '@dolittle/sdk.eventhorizon';
import { Cancellation } from '@dolittle/sdk.resilience';

import { EventStoreClient } from '@dolittle/runtime.contracts/Runtime/Events/EventStore_grpc_pb';
import { SubscriptionsClient } from '@dolittle/runtime.contracts/Runtime/EventHorizon/Subscriptions_grpc_pb';
import { LoggingBuilder, LoggingBuilderCallback } from './LoggingBuilder';


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
     * Create a client builder for a Microservice
     * @param {Guid | string} microserviceId The unique identifier for the microservice.
     * @param {Version} [version] Optional version of the software. Defaults to 1.0.0.0.
     * @param {string} [environment] The environment the software is running in. (e.g. development, production). Defaults to 'Development'.
     * @returns {ClientBuilder} The builder to build a {Client} from.
     */
    static create() {
        return new ClientBuilder();
    }
}

/**
 * Represents a builder for building {Client}.
 */
export class ClientBuilder {
    private _host = 'localhost';
    private _port = 50053;
    private _environment: Environment = Environment.undetermined;
    private _microserviceBuilder: MicroserviceBuilder;
    private _eventHorizonsBuilder: EventHorizonsBuilder;
    private _cancellation: Cancellation;
    private _loggingBuilder: LoggingBuilder;
    private _container: IContainer = new Container();
    private _eventStoreBuilder: EventStoreBuilder;

    /**
     * Creates an instance of client builder.
     */
    constructor() {
        this._microserviceBuilder = new MicroserviceBuilder(MicroserviceId.notApplicable);
        this._eventHorizonsBuilder = new EventHorizonsBuilder();
        this._cancellation = Cancellation.default;
        this._loggingBuilder = new LoggingBuilder();
        this._eventStoreBuilder = new EventStoreBuilder();
    }

    /**
     * Configure the microservice.
     * @param microserviceId The unique identifierfor the microservice.
     * @param callback The builder callback.
     * @returns {ClientBuilder} The client builder for continuation.
     */
    forMicroservice(microserviceId: MicroserviceId | string, callback?: MicroserviceBuilderCallback): ClientBuilder {
        this._microserviceBuilder = new MicroserviceBuilder(MicroserviceId.from(microserviceId));
        if (callback) {
            callback(this._microserviceBuilder);
        }
        return this;
    }

    /**
     * Sets the environment where the software is running.
     * @param {string} [environment] The environment the software is running in. (e.g. development, production).
     * @returns {ClientBuilder} The client builder for continuation.
     */
    forEnvironment(environment: string): ClientBuilder {
        this._environment = Environment.from(environment);
        return this;
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
     * Configure event types, event handlers and event filters.
     * @param {EventStoreBuilderCallback} callback The builder callback.
     * @returns {ClientBuilder} The client builder for continuation.
     */
    withEventStore(callback: EventStoreBuilderCallback): ClientBuilder {
        callback(this._eventStoreBuilder);
        return this;
    }

    /**
     * Connect to a specific host and port for the Dolittle runtime.
     * @param {string} host The host name to connect to.
     * @param {number} port The port to connect to.
     * @returns {ClientBuilder} The client builder for continuation.
     * @summary If not used, the default host of 'localhost' and port 50053 will be used.
     */
    connectToRuntime(host: string, port: number): ClientBuilder {
        this._host = host;
        this._port = port;
        return this;
    }

    /**
     * Configures logging for the SDK.
     * @param {LoggingConfigurationCallback} callback Callback for setting Winston {LoggerOptions}.
     * @returns {ClientBuilder}
     */
    withLogging(callback: LoggingBuilderCallback): ClientBuilder {
        callback(this._loggingBuilder);
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
    withContainer(container: IContainer): ClientBuilder {
        this._container = container;
        return this;
    }

    /**
     * Build the {Client}.
     * @returns {Client}
     */
    build(): Client {
        const [microserviceId, version]  = this._microserviceBuilder.build();
        const logger = this._loggingBuilder.build(microserviceId);
        const connectionString = `${this._host}:${this._port}`;
        const credentials = grpc.credentials.createInsecure();
        const executionContextManager = new ExecutionContextManager(microserviceId, version, this._environment);

        const [artifacts, eventHandlers, filters] = this._eventStoreBuilder.build(
            connectionString,
            credentials,
            this._container,
            executionContextManager,
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
