// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EmbeddingsClient } from '@dolittle/runtime.contracts/Embeddings/Embeddings_grpc_pb';
import { EmbeddingStoreClient } from '@dolittle/runtime.contracts/Embeddings/Store_grpc_pb';
import { SubscriptionsClient } from '@dolittle/runtime.contracts/EventHorizon/Subscriptions_grpc_pb';
import { EventHandlersClient } from '@dolittle/runtime.contracts/Events.Processing/EventHandlers_grpc_pb';
import { FiltersClient } from '@dolittle/runtime.contracts/Events.Processing/Filters_grpc_pb';
import { ProjectionsClient } from '@dolittle/runtime.contracts/Events.Processing/Projections_grpc_pb';
import { EventStoreClient } from '@dolittle/runtime.contracts/Events/EventStore_grpc_pb';
import { ProjectionsClient as GetProjectionsClient } from '@dolittle/runtime.contracts/Projections/Store_grpc_pb';
import { EventTypesClient } from '@dolittle/runtime.contracts/Events/EventTypes_grpc_pb';
import { Container, IContainer } from '@dolittle/sdk.common';
import { Embeddings, EmbeddingsBuilder, EmbeddingsBuilderCallback } from '@dolittle/sdk.embeddings';
import { SubscriptionsBuilder, SubscriptionsBuilderCallback } from '@dolittle/sdk.eventhorizon';
import { EventStoreBuilder, EventTypes, EventTypesBuilder, EventTypesBuilderCallback, internal as eventsInternal } from '@dolittle/sdk.events';
import { EventFiltersBuilder, EventFiltersBuilderCallback } from '@dolittle/sdk.events.filtering';
import { EventHandlersBuilder, EventHandlersBuilderCallback } from '@dolittle/sdk.events.handling';
import { Claims, CorrelationId, Environment, ExecutionContext, MicroserviceId, TenantId, Version } from '@dolittle/sdk.execution';
import { IProjectionAssociations, ProjectionAssociations, ProjectionsBuilder, ProjectionsBuilderCallback, ProjectionStoreBuilder } from '@dolittle/sdk.projections';
import { Cancellation } from '@dolittle/sdk.resilience';
import { internal as tenancyInternal } from '@dolittle/sdk.tenancy';
import * as grpc from '@grpc/grpc-js';
import { createLogger, format, Logger, transports } from 'winston';
import { AggregateRootsBuilder, AggregateRootsBuilderCallback, internal as aggregatesInternal } from '@dolittle/sdk.aggregates';
import { AggregateRootsClient } from '@dolittle/runtime.contracts/Aggregates/AggregateRoots_grpc_pb';
import { TenantsClient } from '@dolittle/runtime.contracts/Tenancy/Tenants_grpc_pb';
import { DolittleClient } from './DolittleClient';



/**
 * Represents a builder for building {DolittleClient}.
 */

export class DolittleClientBuilder {
    private _host = 'localhost';
    private _port = 50053;
    private _environment: Environment = Environment.undetermined;
    private _version: Version = Version.notSet;
    private readonly _eventHorizonsBuilder: SubscriptionsBuilder;
    private readonly _aggregateRootsBuilder: AggregateRootsBuilder;
    private readonly _eventTypesBuilder: EventTypesBuilder;
    private readonly _eventHandlersBuilder: EventHandlersBuilder;
    private readonly _filtersBuilder: EventFiltersBuilder;
    private readonly _projectionsBuilder: ProjectionsBuilder;
    private readonly _projectionsAssociations: IProjectionAssociations;
    private readonly _embeddingsBuilder: EmbeddingsBuilder;
    private _cancellation: Cancellation;
    private _logger: Logger;
    private _container: IContainer = new Container();

    /**
     * Creates an instance of client builder.
     */
    constructor(private readonly _microserviceId: MicroserviceId) {
        this._eventHorizonsBuilder = new SubscriptionsBuilder();
        this._cancellation = Cancellation.default;
        this._aggregateRootsBuilder = new AggregateRootsBuilder();
        this._eventTypesBuilder = new EventTypesBuilder();
        this._eventHandlersBuilder = new EventHandlersBuilder();
        this._filtersBuilder = new EventFiltersBuilder();
        this._projectionsAssociations = new ProjectionAssociations();
        this._embeddingsBuilder = new EmbeddingsBuilder(this._projectionsAssociations);
        this._projectionsBuilder = new ProjectionsBuilder(this._projectionsAssociations);
        this._logger = createLogger({
            level: 'info',
            format: format.simple(),
            transports: [
                new transports.Console({
                    format: format.simple()
                })
            ]
        });
    }

    /**
     *  Sets the version of the microservice.
     * @param {Version} version Version of the microservice.
     * @returns {DolittleClientBuilder} The client builder for continuation.
     */
    withVersion(version: Version): DolittleClientBuilder;
    /**
     * Sets the version of the microservice.
     * @param {number} major Major version of the microservice.
     * @param {number} minor Minor version of the microservice.
     * @param {number} patch Patch version of the microservice.
     * @returns {DolittleClientBuilder} The client builder for continuation.
     */
    withVersion(major: number, minor: number, patch: number): DolittleClientBuilder;
    /**
     * Sets the version of the microservice.
     * @param {number} major Major version of the microservice.
     * @param {number} minor Minor version of the microservice.
     * @param {number} patch Patch version of the microservice.
     * @param {number} build Builder number of the microservice.
     * @param {string} preReleaseString If prerelease - the prerelease string.
     * @returns {DolittleClientBuilder} The client builder for continuation.
     */
    withVersion(major: number, minor: number, patch: number, build: number, preReleaseString: string): DolittleClientBuilder;
    withVersion(versionOrMajor: Version | number, minor?: number, patch?: number, build?: number, preReleaseString?: string): DolittleClientBuilder {
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
     * @returns {DolittleClientBuilder} The client builder for continuation.
     */
    withEnvironment(environment: Environment | string): DolittleClientBuilder {
        this._environment = Environment.from(environment);
        return this;
    }

    /**
     * Configure event horizons and any subscriptions.
     * @param {EventHorizonsBuilderCallback} callback The builder callback.
     * @returns {DolittleClientBuilder} The client builder for continuation.
     */
    withEventHorizons(callback: SubscriptionsBuilderCallback): DolittleClientBuilder {
        callback(this._eventHorizonsBuilder);
        return this;
    }

    /**
     * Configure event types.
     *
     * @param {ArtifactsBuilderCallback} callback The builder callback
     * @returns {DolittleClientBuilder} The client builder for continuation.
     */
    withAggregateRoots(callback: AggregateRootsBuilderCallback): DolittleClientBuilder {
        callback(this._aggregateRootsBuilder);
        return this;
    }

    /**
     * Configure event types.
     *
     * @param {ArtifactsBuilderCallback} callback The builder callback
     * @returns {DolittleClientBuilder} The client builder for continuation.
     */
    withEventTypes(callback: EventTypesBuilderCallback): DolittleClientBuilder {
        callback(this._eventTypesBuilder);
        return this;
    }

    /**
     * Configure the event handlers.
     *
     * @param {EventHandlersBuilderCallback} callback The builder callback.
     * @returns {DolittleClientBuilder} The client builder for continuation.
     */
    withEventHandlers(callback: EventHandlersBuilderCallback): DolittleClientBuilder {
        callback(this._eventHandlersBuilder);
        return this;
    }

    /**
     * Configure the event filters.
     *
     * @param {EventFiltersBuilderCallback} callback The builder callback.
     * @returns {DolittleClientBuilder} The client builder for continuation.
     */
    withFilters(callback: EventFiltersBuilderCallback): DolittleClientBuilder {
        callback(this._filtersBuilder);
        return this;
    }

    /**
     * Connect to a specific host and port for the Dolittle runtime.
     * @param {string} host The host name to connect to.
     * @param {number} port The port to connect to.
     * @returns {DolittleClientBuilder} The client builder for continuation.
     * @summary If not used, the default host of 'localhost' and port 50053 will be used.
     */
    withRuntimeOn(host: string, port: number): DolittleClientBuilder {
        this._host = host;
        this._port = port;
        return this;
    }

    /**
     * Set the winston logger to use in the microservice.
     * @param {Logger} logger A winston logger.
     * @returns {DolittleClientBuilder}
     * @see {@link https://github.com/winstonjs/winston|winston} for further information.
     */
    withLogging(logger: Logger): DolittleClientBuilder {
        this._logger = logger;
        return this;
    }

    /**
     * Configures cancellation for closing open connections to the Runtime.
     * @param {Cancellation} cancellation The cancellation that will be passed to Filters and Event Handlers.
     * @returns {DolittleClientBuilder}
     */
    withCancellation(cancellation: Cancellation): DolittleClientBuilder {
        this._cancellation = cancellation;
        return this;
    }

    /**
     * Use a specific IoC container for creating instances of types.
     * @param {IContainer} container Container
     * @returns {DolittleClientBuilder}
     */
    withContainer(container: IContainer): DolittleClientBuilder {
        this._container = container;
        return this;
    }

    /**
     * Configure projections.
     * @param {ProjectionsBuilderCallback} callback The builder callback
     * @returns {DolittleClientBuilder}
     */
    withProjections(callback: ProjectionsBuilderCallback): DolittleClientBuilder {
        callback(this._projectionsBuilder);
        return this;
    }

    /**
     * Configure embeddings.
     * @param {EmbeddingsBuilderCallback} callback The builder callback.
     * @returns {DolittleClientBuilder}
     */
    withEmbeddings(callback: EmbeddingsBuilderCallback): DolittleClientBuilder {
        callback(this._embeddingsBuilder);
        return this;
    }

    /**
     * Build the {Client}.
     * @returns {DolittleClient}
     */
    build(): DolittleClient {
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
        this._eventTypesBuilder.buildAndRegister(new eventsInternal.EventTypes(new EventTypesClient(connectionString, credentials), executionContext, this._logger), this._cancellation);
        this._aggregateRootsBuilder.buildAndRegister(new aggregatesInternal.AggregateRoots(new AggregateRootsClient(connectionString, credentials), executionContext, this._logger), this._cancellation);
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
        const eventHorizons = this._eventHorizonsBuilder.build(
            subscriptionsClient,
            executionContext,
            this._logger,
            this._cancellation);

        this._projectionsBuilder.buildAndRegister(
            new ProjectionsClient(connectionString, credentials),
            this._container,
            executionContext,
            eventTypes,
            this._logger,
            this._cancellation
        );

        const projectionsStore = new ProjectionStoreBuilder(
            new GetProjectionsClient(connectionString, credentials),
            executionContext,
            this._projectionsAssociations,
            this._logger
        );

        const embeddingsClient = new EmbeddingsClient(connectionString, credentials);
        this._embeddingsBuilder.buildAndRegister(
            embeddingsClient,
            this._container,
            executionContext,
            eventTypes,
            this._logger,
            this._cancellation);

        const embeddingsStoreClient = new EmbeddingStoreClient(connectionString, credentials);
        const embeddings = new Embeddings(
            embeddingsStoreClient,
            embeddingsClient,
            executionContext,
            this._projectionsAssociations,
            this._logger);

        const tenants = new tenancyInternal.Tenants(new TenantsClient(connectionString, credentials), this._logger);

        return new DolittleClient(
            this._logger,
            eventTypes,
            eventStoreBuilder,
            eventHandlers,
            filters,
            eventHorizons,
            projectionsStore,
            embeddings,
            tenants);
    }
}
