// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { HandshakeClient } from '@dolittle/runtime.contracts/Handshake/Handshake_grpc_pb';
import { EventHandlersClient } from '@dolittle/runtime.contracts/Events.Processing/EventHandlers_grpc_pb';

import { AggregateRootsBuilder, IAggregatesBuilder } from '@dolittle/sdk.aggregates';
import { EmbeddingsBuilder, Embeddings, IEmbeddings } from '@dolittle/sdk.embeddings';
import { EventHorizons, IEventHorizons, SubscriptionsBuilder } from '@dolittle/sdk.eventhorizon';
import { EventStoreBuilder, EventTypes, EventTypesBuilder, IEventStoreBuilder, IEventTypes } from '@dolittle/sdk.events';
import { EventFiltersBuilder } from '@dolittle/sdk.events.filtering';
import { EventHandlersBuilder } from '@dolittle/sdk.events.handling';
import { IProjectionStoreBuilder, ProjectionAssociations, ProjectionsBuilder, ProjectionStoreBuilder } from '@dolittle/sdk.projections';
import { Cancellation, CancellationSource } from '@dolittle/sdk.resilience';
import { IResourcesBuilder, ResourcesBuilder } from '@dolittle/sdk.resources';
import { Tenant } from '@dolittle/sdk.tenancy';
import grpc from '@grpc/grpc-js';

import { ConfigurationBuilder, ConnectCallback, SetupBuilder, SetupCallback } from './Builders/';
import { CannotConnectDolittleClientMultipleTimes } from './CannotConnectDolittleClientMultipleTimes';
import { DolittleClientConfiguration } from './DolittleClientConfiguration';
import { IDolittleClient } from './IDolittleClient';
import { ConnectConfiguration } from './Internal';
import { TenantsClient } from '@dolittle/runtime.contracts/Tenancy/Tenants_grpc_pb';
import { EventTypesClient } from '@dolittle/runtime.contracts/Events/EventTypes_grpc_pb';
import { AggregateRootsClient } from '@dolittle/runtime.contracts/Aggregates/AggregateRoots_grpc_pb';
import { FiltersClient } from '@dolittle/runtime.contracts/Events.Processing/Filters_grpc_pb';
import { ProjectionsClient } from '@dolittle/runtime.contracts/Events.Processing/Projections_grpc_pb';
import { ProjectionsClient as ProjectionStoreClient } from '@dolittle/runtime.contracts/Projections/Store_grpc_pb';
import { EmbeddingsClient } from '@dolittle/runtime.contracts/Embeddings/Embeddings_grpc_pb';
import { EmbeddingStoreClient } from '@dolittle/runtime.contracts/Embeddings/Store_grpc_pb';
import { SubscriptionsClient } from '@dolittle/runtime.contracts/EventHorizon/Subscriptions_grpc_pb';
import { Claims, CorrelationId, Environment, ExecutionContext, MicroserviceId, TenantId, Version } from '@dolittle/sdk.execution';
import tenants from '@dolittle/runtime.contracts/Tenancy/Tenants_pb';
import { callContexts } from '@dolittle/sdk.protobuf';
import { reactiveUnary } from '@dolittle/sdk.services';
import { add, Logger } from 'winston';
import { Tenants } from '@dolittle/sdk.tenancy/internal';
import { EventStoreClient } from '@dolittle/runtime.contracts/Events/EventStore_grpc_pb';
import { ResourcesClient } from '@dolittle/runtime.contracts/Resources/Resources_grpc_pb';
import { EventTypes as InternalEventTypes } from '@dolittle/sdk.events/internal';
import { AggregateRoots as InternalAggregateRoots } from '@dolittle/sdk.aggregates/internal';
import { IContainer } from '@dolittle/sdk.common';

/**
 * Represents the client for working with the Dolittle Runtime.
 */
export class DolittleClient extends IDolittleClient {
    private _cancellationSource: CancellationSource = new CancellationSource();
    private _connected: boolean = false;

    private _eventTypes?: EventTypes;
    private _eventStore?: EventStoreBuilder;
    // TODO: Aggregates
    private _projections?: ProjectionStoreBuilder;
    private _embeddings?: Embeddings;
    private _tenants: Tenant[] = [];
    private _resources?: ResourcesBuilder;
    private _eventHorizons?: IEventHorizons;

    /**
     * Initialises a new instance of the {@link DolittleClient} class.
     * @param {EventTypesBuilder} _eventTypesBuilder - The {@link EventTypesBuilder}.
     * @param {AggregateRootsBuilder} _aggregateRootsBuilder - The {@link AggregateRootsBuilder}.
     * @param {EventFiltersBuilder} _eventFiltersBuilder - The {@link EventFiltersBuilder}.
     * @param {EventHandlersBuilder} _eventHandlersBuilder - The {@link EventHandlersBuilder}.
     * @param {ProjectionAssociations} _projectionsAssociations - The {@link ProjectionAssociations}.
     * @param {ProjectionsBuilder} _projectionsBuilder - The {@link ProjectionsBuilder}.
     * @param {EmbeddingsBuilder} _embeddingsBuilder - The {@link EmbeddingsBuilder}.
     * @param {SubscriptionsBuilder} _subscriptionsBuilder - The {@link SubscriptionsBuilder}.
     */
    constructor(
        private readonly _eventTypesBuilder: EventTypesBuilder,
        private readonly _aggregateRootsBuilder: AggregateRootsBuilder,
        private readonly _eventFiltersBuilder: EventFiltersBuilder,
        private readonly _eventHandlersBuilder: EventHandlersBuilder,
        private readonly _projectionsAssociations: ProjectionAssociations,
        private readonly _projectionsBuilder: ProjectionsBuilder,
        private readonly _embeddingsBuilder: EmbeddingsBuilder,
        private readonly _subscriptionsBuilder: SubscriptionsBuilder
    ) {
        super();
    }

    /** @inheritdoc */
    get connected(): boolean {
        return this._connected;
    }

    /** @inheritdoc */
    get eventTypes(): IEventTypes {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    get eventStore(): IEventStoreBuilder {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    get aggregates(): IAggregatesBuilder {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    get projections(): IProjectionStoreBuilder {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    get embeddings(): IEmbeddings {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    get tenants(): Tenant[] {
        return this._tenants.slice();
    }

    /** @inheritdoc */
    get resources(): IResourcesBuilder {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    get eventHorizons(): IEventHorizons {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    connect(configuration: DolittleClientConfiguration, cancellation?: Cancellation): Promise<IDolittleClient>;
    connect(callback: ConnectCallback, cancellation?: Cancellation): Promise<IDolittleClient>;
    connect(cancellation?: Cancellation): Promise<IDolittleClient>;
    async connect(configurationOrCallbackOrCancellation?: DolittleClientConfiguration | ConnectCallback | Cancellation, maybeCancellation?: Cancellation): Promise<IDolittleClient> {
        const actualConfiguration =
            configurationOrCallbackOrCancellation === undefined ? {} :
            configurationOrCallbackOrCancellation instanceof Cancellation ? {} :
            typeof configurationOrCallbackOrCancellation === 'function' ? {} :
            configurationOrCallbackOrCancellation;

        const actualCancellation =
            configurationOrCallbackOrCancellation instanceof Cancellation ? configurationOrCallbackOrCancellation :
            maybeCancellation instanceof Cancellation ? maybeCancellation :
            Cancellation.default;

        const configurationBuilder = new ConfigurationBuilder(actualConfiguration);
        if (typeof configurationOrCallbackOrCancellation === 'function') {
            configurationOrCallbackOrCancellation(configurationBuilder);
        }
        const builtConfiguration = configurationBuilder.build();

        await this.connectToRuntime(builtConfiguration, actualCancellation);

        return this;
    }

    /**
     * Setup a new {@link IDolittleClient}.
     * @param {SetupCallback} [callback] - The optional callback to use to setup the new client.
     * @returns {IDolittleClient} An new unconnected client.
     */
    static setup(callback?: SetupCallback): IDolittleClient {
        const builder = new SetupBuilder();

        if (typeof callback === 'function') {
            callback(builder);
        }

        return builder.build();
    }

    private async connectToRuntime(configuration: ConnectConfiguration, cancellation: Cancellation): Promise<void> {
        if (this._connected) {
            throw new CannotConnectDolittleClientMultipleTimes();
        }
        this._connected = true;

        try {
            this._cancellationSource = new CancellationSource();

            const logger = configuration.logger;
            const clients = this.createGrpcClients(configuration.runtimeHost, configuration.runtimePort);

            const executionContext = await this.performHandshake(clients.handshake, configuration.version, cancellation);

            const tenants = new Tenants(clients.tenants, executionContext, logger);
            this._tenants = await tenants.getAll();

            this.buildClientServices(
                clients.eventStore,
                clients.projectionStore,
                clients.embeddingStore,
                clients.embeddings,
                clients.resources,
                executionContext,
                logger);

            this.registerTypes(
                clients.eventTypes,
                clients.aggregateRoots,
                executionContext,
                logger);

            this.startReverseCallClients(
                clients.filters,
                clients.eventHandlers,
                clients.projections,
                clients.embeddings,
                clients.eventHorizons,
                executionContext,
                logger);
        } catch (exception) {
            this._connected = false;
            throw exception;
        }
    }

    private async performHandshake(client: HandshakeClient, version: Version, cancellation: Cancellation): Promise<ExecutionContext> {
        // TODO: Connect to the runtime and fetch the information

        return new ExecutionContext(
            MicroserviceId.notApplicable,
            TenantId.system,
            version,
            Environment.undetermined,
            CorrelationId.system,
            Claims.empty);
    }

    private buildClientServices(
        eventStoreClient: EventStoreClient,
        projectionStoreClient: ProjectionStoreClient,
        embeddingStoreClient: EmbeddingStoreClient,
        embeddingsClient: EmbeddingsClient,
        resourcesClient: ResourcesClient,
        executionContext: ExecutionContext,
        logger: Logger
    ) {
        this._eventTypes = new EventTypes();
        this._eventTypesBuilder.addAssociationsInto(this._eventTypes);

        this._eventStore = new EventStoreBuilder(
            eventStoreClient,
            this._eventTypes,
            executionContext,
            logger);

        // TODO: Aggregates

        this._projections = new ProjectionStoreBuilder(
            projectionStoreClient,
            executionContext,
            this._projectionsAssociations,
            logger);

        this._embeddings = new Embeddings(
            embeddingStoreClient,
            embeddingsClient,
            executionContext,
            this._projectionsAssociations,
            logger);

        this._resources = new ResourcesBuilder(
            resourcesClient,
            executionContext,
            logger);
    }

    private registerTypes(
        eventTypesClient: EventTypesClient,
        aggregateRootsClient: AggregateRootsClient,
        executionContext: ExecutionContext,
        logger: Logger
    ) {
        const eventTypes = new InternalEventTypes(
            eventTypesClient,
            executionContext,
            logger);
        this._eventTypesBuilder.buildAndRegister(
            eventTypes,
            this._cancellationSource.cancellation);

        const aggregateRoots = new InternalAggregateRoots(
            aggregateRootsClient,
            executionContext,
            logger);
        this._aggregateRootsBuilder.buildAndRegister(
            aggregateRoots,
            this._cancellationSource.cancellation);
    }

    private startReverseCallClients(
        filtersClient: FiltersClient,
        eventHandlersClient: EventHandlersClient,
        projectionsClient: ProjectionsClient,
        embeddingsClient: EmbeddingsClient,
        subscriptionsClient: SubscriptionsClient,
        executionContext: ExecutionContext,
        logger: Logger
    ) {
        this._eventFiltersBuilder.buildAndRegister(
            filtersClient,
            executionContext,
            this._eventTypes!,
            logger,
            this._cancellationSource.cancellation);

        this._eventHandlersBuilder.buildAndRegister(
            eventHandlersClient,
            {} as IContainer, // TODO: Implement container
            executionContext,
            this._eventTypes!,
            logger,
            this._cancellationSource.cancellation);

        this._projectionsBuilder.buildAndRegister(
            projectionsClient,
            {} as IContainer,
            executionContext,
            this._eventTypes!,
            logger,
            this._cancellationSource.cancellation);

        this._embeddingsBuilder.buildAndRegister(
            embeddingsClient,
            {} as IContainer,
            executionContext,
            this._eventTypes!,
            logger,
            this._cancellationSource.cancellation);

        this._eventHorizons = this._subscriptionsBuilder.build(
            subscriptionsClient,
            executionContext,
            logger,
            this._cancellationSource.cancellation);
    }

    private createGrpcClients(runtimeHost: string, runtimePort: number) {
        const address = `${runtimeHost}:${runtimePort}`;
        const credentials = grpc.credentials.createInsecure();

        return {
            handshake: new HandshakeClient(address, credentials),
            tenants: new TenantsClient(address, credentials),
            eventTypes: new EventTypesClient(address, credentials),
            eventStore: new EventStoreClient(address, credentials),
            aggregateRoots: new AggregateRootsClient(address, credentials),
            filters: new FiltersClient(address, credentials),
            eventHandlers: new EventHandlersClient(address, credentials),
            projections: new ProjectionsClient(address, credentials),
            projectionStore: new ProjectionStoreClient(address, credentials),
            embeddings: new EmbeddingsClient(address, credentials),
            embeddingStore: new EmbeddingStoreClient(address, credentials),
            resources: new ResourcesClient(address, credentials),
            eventHorizons: new SubscriptionsClient(address, credentials),
        };
    }
}
