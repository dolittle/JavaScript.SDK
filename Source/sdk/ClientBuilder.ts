// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import * as grpc from '@grpc/grpc-js';
import { createLogger, format, Logger, transports } from 'winston';

import { EventTypes, EventTypesBuilder, EventTypesBuilderCallback } from '@dolittle/sdk.artifacts';
import { IContainer, Container } from '@dolittle/sdk.common';
import { EventStoreBuilder } from '@dolittle/sdk.events';
import { EventFiltersBuilder, EventFiltersBuilderCallback } from '@dolittle/sdk.events.filtering';
import { EventHandlersBuilder, EventHandlersBuilderCallback } from '@dolittle/sdk.events.handling';
import { MicroserviceId, Environment, ExecutionContext, TenantId, CorrelationId, Claims, Version } from '@dolittle/sdk.execution';
import { SubscriptionsBuilder, SubscriptionsBuilderCallback } from '@dolittle/sdk.eventhorizon';
import { ProjectionsBuilder, ProjectionsBuilderCallback } from '@dolittle/sdk.projections';
import { Cancellation } from '@dolittle/sdk.resilience';
import { EventStoreClient } from '@dolittle/runtime.contracts/Runtime/Events/EventStore_grpc_pb';
import { SubscriptionsClient } from '@dolittle/runtime.contracts/Runtime/EventHorizon/Subscriptions_grpc_pb';
import { EventHandlersClient } from '@dolittle/runtime.contracts/Runtime/Events.Processing/EventHandlers_grpc_pb';
import { ProjectionsClient } from '@dolittle/runtime.contracts/Runtime/Events.Processing/Projections_grpc_pb';
import { FiltersClient } from '@dolittle/runtime.contracts/Runtime/Events.Processing/Filters_grpc_pb';

import { Client } from './Client';

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
    private readonly _projectionsBuilder: ProjectionsBuilder;
    private _cancellation: Cancellation;
    private _logger: Logger;
    private _container: IContainer = new Container();

    /**
     * Creates an instance of client builder.
     */
    constructor(private readonly _microserviceId: MicroserviceId) {
        this._eventHorizonsBuilder = new SubscriptionsBuilder();
        this._cancellation = Cancellation.default;
        this._eventTypesBuilder = new EventTypesBuilder();
        this._eventHandlersBuilder = new EventHandlersBuilder();
        this._filtersBuilder = new EventFiltersBuilder();
        this._projectionsBuilder = new ProjectionsBuilder();
        this._logger = createLogger({
            level: 'info',
            format: format.prettyPrint(),
            defaultMeta: { microserviceId: _microserviceId.toString() },
            transports: [
                new transports.Console({
                    format: format.prettyPrint()
                })
            ]
        });
    }

    /**
     *  Sets the version of the microservice.
     * @param {Version} version Version of the microservice.
     * @returns {ClientBuilder} The client builder for continuation.
     */
    withVersion(version: Version): ClientBuilder;
    /**
     * Sets the version of the microservice.
     * @param {number} major Major version of the microservice.
     * @param {number} minor Minor version of the microservice.
     * @param {number} patch Patch version of the microservice.
     * @returns {ClientBuilder} The client builder for continuation.
     */
    withVersion(major: number, minor: number, patch: number): ClientBuilder;
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
    withVersion(versionOrMajor: Version | number, minor?: number, patch?: number, build?: number, preReleaseString?: string): ClientBuilder {
        if (typeof versionOrMajor == 'number') {
            this._version = new Version(versionOrMajor as number, minor as number, patch as number, build || 0, preReleaseString || '');
        } else if (versionOrMajor instanceof Version) {
            this._version = versionOrMajor;
        }
        return this;
    }

    /**
     * Sets the environment where the software is running.
     * @param {Environment | string} environment The environment the software is running in. (e.g. development, production).
     * @returns {ClientBuilder} The client builder for continuation.
     */
    withEnvironment(environment: Environment | string): ClientBuilder {
        this._environment = Environment.from(environment);
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
    withRuntimeOn(host: string, port: number): ClientBuilder {
        this._host = host;
        this._port = port;
        return this;
    }

    /**
     * Set the winston logger to use in the microservice.
     * @param {Logger} logger A winston logger.
     * @returns {ClientBuilder}
     * @see {@link https://github.com/winstonjs/winston|winston} for further information.
     */
    withLogging(logger: Logger): ClientBuilder {
        this._logger = logger;
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
     * Configure projections.
     * @param {ProjectionsBuilderCallback} callback The builder callback
     * @returns {ClientBuilder}
     */
    withProjections(callback: ProjectionsBuilderCallback): ClientBuilder {
        callback(this._projectionsBuilder);
        return this;
    }

    /**
     * Build the {Client}.
     * @returns {Client}
     */
    build(): Client {
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
            this._logger);
        const eventHandlers = this._eventHandlersBuilder.buildAndRegister(
            new EventHandlersClient(connectionString, credentials),
            this._container,
            executionContext,
            eventTypes,
            this._logger,
            this._cancellation);

        const filters = this._filtersBuilder.buildAndRegister(
            new FiltersClient(connectionString, credentials),
            executionContext,
            eventTypes,
            this._logger,
            this._cancellation);

        const subscriptionsClient = new SubscriptionsClient(connectionString, credentials);
        const eventHorizons = this._eventHorizonsBuilder.build(subscriptionsClient, executionContext, this._logger);

        const projections = this._projectionsBuilder.buildAndRegister(
            new ProjectionsClient(connectionString, credentials),
            this._container,
            executionContext,
            eventTypes,
            this._logger,
            this._cancellation
        );

        return new Client(
            this._logger,
            eventTypes,
            eventStoreBuilder,
            eventHandlers,
            filters,
            eventHorizons,
            projections
        );
    }
}
