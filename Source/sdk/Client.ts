// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import grpc from 'grpc';
import { Logger} from 'winston';

import { EventTypes, EventTypesBuilder, EventTypesBuilderCallback, IEventTypes } from '@dolittle/sdk.artifacts';
import { IContainer, Container } from '@dolittle/sdk.common';
import { EventStoreBuilder } from '@dolittle/sdk.events';
import { EventFiltersBuilder, EventFiltersBuilderCallback, IFilters } from '@dolittle/sdk.events.filtering';
import { EventHandlersBuilder, EventHandlersBuilderCallback, IEventHandlers } from '@dolittle/sdk.events.handling';
import { MicroserviceId, Environment, ExecutionContext, TenantId, CorrelationId, Claims, Version } from '@dolittle/sdk.execution';
import { SubscriptionsBuilder, SubscriptionsBuilderCallback, IEventHorizons } from '@dolittle/sdk.eventhorizon';
import { Cancellation } from '@dolittle/sdk.resilience';

import { EventStoreClient } from '@dolittle/runtime.contracts/Runtime/Events/EventStore_grpc_pb';
import { SubscriptionsClient } from '@dolittle/runtime.contracts/Runtime/EventHorizon/Subscriptions_grpc_pb';
import { LoggingBuilder, LoggingBuilderCallback } from './LoggingBuilder';
import { EventHandlersClient } from '@dolittle/runtime.contracts/Runtime/Events.Processing/EventHandlers_grpc_pb';
import { FiltersClient } from '@dolittle/runtime.contracts/Runtime/Events.Processing/Filters_grpc_pb';


/**
 * Represents the client for working with the Dolittle Runtime
 */
export class Client {

    /**
     * Creates an instance of client.
     * @param {Logger} logger Winston Logger for logging.
     * @param {IArtifacts} artifacts All the configured artifacts.
     * @param {EventStoreBuilder} eventStore The event store builder to work with.
     * @param {IEventHandlers} eventHandlers All the event handlers.
     * @param {IFilters} filters All the filters.
     * @param {IEventHorizons} eventHorizons All event horizons.
     */
    constructor(
        readonly logger: Logger,
        readonly eventTypes: IEventTypes,
        readonly eventStore: EventStoreBuilder,
        readonly eventHandlers: IEventHandlers,
        readonly filters: IFilters,
        readonly eventHorizons: IEventHorizons) {
    }

    /**
     * Create a client builder for a Microservice
     * @param {MicroserviceId | string} microserviceId The unique identifier for the microservice.
     * @returns {ClientBuilder} The builder to build a {Client} from.
     */
    static forMicroservice(microserviceId: MicroserviceId | string) {
        return new ClientBuilder(MicroserviceId.from(microserviceId));
    }
}

/**
 * Represents a builder for building {Client}.
 */
export class ClientBuilder {
    private _host = 'localhost';
    private _port = 50053;
    private _environment: Environment = Environment.undetermined;
    private _version: Version = Version.notSet;
    private readonly _eventHorizonsBuilder: SubscriptionsBuilder;
    private readonly _eventTypesBuilder: EventTypesBuilder;
    private readonly _eventHandlersBuilder: EventHandlersBuilder;
    private readonly _filtersBuilder: EventFiltersBuilder;
    private _cancellation: Cancellation;
    private _loggingBuilder: LoggingBuilder;
    private _container: IContainer = new Container();

    /**
     * Creates an instance of client builder.
     */
    constructor(private readonly _microserviceId: MicroserviceId) {
        this._eventHorizonsBuilder = new SubscriptionsBuilder();
        this._cancellation = Cancellation.default;
        this._loggingBuilder = new LoggingBuilder();
        this._eventTypesBuilder = new EventTypesBuilder();
        this._eventHandlersBuilder = new EventHandlersBuilder();
        this._filtersBuilder = new EventFiltersBuilder();
    }

    /**
     * Sets the environment where the software is running.
     * @param {string} [environment] The environment the software is running in. (e.g. development, production).
     * @returns {ClientBuilder} The client builder for continuation.
     */
    withEnvironment(environment: string): ClientBuilder {
        this._environment = Environment.from(environment);
        return this;
    }

    /**
     * Sets the version of the microservice.
     * @param {number} major Major version of the microservice.
     * @param {number} minor Minor version of the microservice.
     * @param {number} patch Patch version of the microservice.
     * @param {number} build Builder number of the microservice.
     * @param {string} preReleaseString If prerelease - the prerelease string.
     * @returns {ClientBuilder} The client builder for continuation.
     */
    withVersion(major: number, minor: number, patch: number, build: number, preReleaseString: string): ClientBuilder;
    /**
     * Sets the version of the microservice.
     * @param {number} major Major version of the microservice.
     * @param {number} minor Minor version of the microservice.
     * @param {number} patch Patch version of the microservice.
     * @returns {ClientBuilder} The client builder for continuation.
     */
    withVersion(major: number, minor: number, patch: number): ClientBuilder;
    /**
     *  Sets the version of the microservice.
     * @param {Version} version Version of the microservice. 
     * @returns {ClientBuilder} The client builder for continuation.
     */
    withVersion(version: Version): ClientBuilder;
    withVersion(versionOrMajor: Version | number, minor?: number, patch?: number, build?: number, preReleaseString?: string): ClientBuilder {
        if (typeof versionOrMajor == 'number') {
            this._version = new Version(versionOrMajor as number, minor as number, patch as number, build || 0, preReleaseString || '');
        } else if (versionOrMajor instanceof Version) {
            this._version = versionOrMajor;
        }
        return this;
    }

    /**
     * Configure event horizons and any subscriptions.
     * @param {EventHorizonsBuilderCallback} callback The builder callback.
     * @returns {ClientBuilder} The client builder for continuation.
     */
    withEventHorizons(callback: SubscriptionsBuilderCallback): ClientBuilder {
        callback(this._eventHorizonsBuilder);
        return this;
    }

    /**
     * Configure event types.
     *
     * @param {ArtifactsBuilderCallback} callback The builder callback
     * @returns {ClientBuilder} The client builder for continuation.
     */
    withEventTypes(callback: EventTypesBuilderCallback): ClientBuilder {
        callback(this._eventTypesBuilder);
        return this;
    }

    /**
     * Configure the event handlers.
     *
     * @param {EventHandlersBuilderCallback} callback The builder callback.
     * @returns {ClientBuilder} The client builder for continuation.
     */
    withEventHandlers(callback: EventHandlersBuilderCallback): ClientBuilder {
        callback(this._eventHandlersBuilder);
        return this;
    }

    /**
     * Configure the event filters.
     *
     * @param {EventFiltersBuilderCallback} callback The builder callback.
     * @returns {ClientBuilder} The client builder for continuation.
     */
    withFilters(callback: EventFiltersBuilderCallback): ClientBuilder {
        callback(this._filtersBuilder);
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
        const logger = this._loggingBuilder.build(this._microserviceId);
        const connectionString = `${this._host}:${this._port}`;
        const credentials = grpc.credentials.createInsecure();
        const executionContext = new ExecutionContext(
            this._microserviceId,
            TenantId.system,
            this._version,
            this._environment,
            CorrelationId.system,
            Claims.empty);

        const eventTypes = new EventTypes();
        this._eventTypesBuilder.addAssociationsInto(eventTypes);

        const eventStoreBuilder = new EventStoreBuilder(
            new EventStoreClient(connectionString, credentials),
            eventTypes,
            executionContext,
            logger);
        const eventHandlers = this._eventHandlersBuilder.buildAndRegister(
            new EventHandlersClient(connectionString, credentials),
            this._container,
            executionContext,
            eventTypes,
            logger,
            this._cancellation);

        const filters = this._filtersBuilder.buildAndRegister(
            new FiltersClient(connectionString, credentials),
            executionContext,
            eventTypes,
            logger,
            this._cancellation);

        const subscriptionsClient = new SubscriptionsClient(connectionString, credentials);
        const eventHorizons = this._eventHorizonsBuilder.build(subscriptionsClient, executionContext, logger);

        return new Client(
            logger,
            eventTypes,
            eventStoreBuilder,
            eventHandlers,
            filters,
            eventHorizons
        );
    }
}
