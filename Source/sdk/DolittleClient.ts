// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import * as grpc from '@grpc/grpc-js';
import { Container, Logger } from 'winston';

import { AggregateRootsClient } from '@dolittle/runtime.contracts/Aggregates/AggregateRoots_grpc_pb';
import { EmbeddingsClient } from '@dolittle/runtime.contracts/Embeddings/Embeddings_grpc_pb';
import { EmbeddingStoreClient } from '@dolittle/runtime.contracts/Embeddings/Store_grpc_pb';
import { SubscriptionsClient } from '@dolittle/runtime.contracts/EventHorizon/Subscriptions_grpc_pb';
import { EventStoreClient } from '@dolittle/runtime.contracts/Events/EventStore_grpc_pb';
import { EventTypesClient } from '@dolittle/runtime.contracts/Events/EventTypes_grpc_pb';
import { EventHandlersClient } from '@dolittle/runtime.contracts/Events.Processing/EventHandlers_grpc_pb';
import { FiltersClient } from '@dolittle/runtime.contracts/Events.Processing/Filters_grpc_pb';
import { ProjectionsClient } from '@dolittle/runtime.contracts/Events.Processing/Projections_grpc_pb';
import { HandshakeClient } from '@dolittle/runtime.contracts/Handshake/Handshake_grpc_pb';
import { ProjectionsClient as ProjectionStoreClient } from '@dolittle/runtime.contracts/Projections/Store_grpc_pb';
import { ResourcesClient } from '@dolittle/runtime.contracts/Resources/Resources_grpc_pb';
import { TenantsClient } from '@dolittle/runtime.contracts/Tenancy/Tenants_grpc_pb';

import { AggregateRootsBuilder, AggregatesBuilder, IAggregatesBuilder, internal as AggregatesInternal } from '@dolittle/sdk.aggregates';
import { IServiceProviderBuilder, ITenantServiceProviders, ClientSetup, DependencyInversion } from '@dolittle/sdk.common';
import { Embeddings, IEmbeddings, internal as EmbeddingsInternal } from '@dolittle/sdk.embeddings';
import { EventHorizons, IEventHorizons, SubscriptionCallbacks, TenantWithSubscriptions } from '@dolittle/sdk.eventhorizon';
import { EventStoreBuilder, IEventStore, IEventStoreBuilder, IEventTypes, internal as EventTypesInternal } from '@dolittle/sdk.events';
import { Filters, IFilterProcessor } from '@dolittle/sdk.events.filtering';
import { EventHandlers, internal as EventsHandlingInternal } from '@dolittle/sdk.events.handling';
import { Claims, CorrelationId, Environment, ExecutionContext, MicroserviceId, TenantId, Version } from '@dolittle/sdk.execution';
import { IProjectionStoreBuilder, ProjectionAssociations, Projections, ProjectionStoreBuilder, internal as ProjectionsInternal } from '@dolittle/sdk.projections';
import { Cancellation, CancellationSource } from '@dolittle/sdk.resilience';
import { IResourcesBuilder, ResourcesBuilder } from '@dolittle/sdk.resources';
import { Tenant, internal as TenancyInternal } from '@dolittle/sdk.tenancy';

import { ConfigurationBuilder } from './Builders/ConfigurationBuilder';
import { ConnectCallback } from './Builders/ConnectCallback';
import { SetupBuilder } from './Builders/SetupBuilder';
import { SetupCallback } from './Builders/SetupCallback';
import { ConnectConfiguration } from './Internal/ConnectConfiguration';
import { CannotConnectDolittleClientMultipleTimes } from './CannotConnectDolittleClientMultipleTimes';
import { CannotUseUnconnectedDolittleClient } from './CannotUseUnconnectedDolittleClient';
import { DolittleClientConfiguration } from './DolittleClientConfiguration';
import { IDolittleClient } from './IDolittleClient';

/**
 * Represents the client for working with the Dolittle Runtime.
 */
export class DolittleClient extends IDolittleClient {
    private _cancellationSource: CancellationSource = new CancellationSource();
    private _connected: boolean = false;

    private _eventStore?: EventStoreBuilder;
    private _aggregates?: AggregatesBuilder;
    private _projectionStore?: ProjectionStoreBuilder;
    private _embeddingStore?: Embeddings;
    private _tenants: Tenant[] = [];
    private _resources?: ResourcesBuilder;
    private _eventHorizons?: IEventHorizons;

    /**
     * Initialises a new instance of the {@link DolittleClient} class.
     * @param {IServiceProviderBuilder} _serviceProviderBuilder - The service provider builder with bound services from the setup.
     * @param {ClientSetup.ClientBuildResults} _setupResults - The results from building the client artifacts.
     * @param {IEventTypes} eventTypes - The built event types.
     * @param {AggregateRootsBuilder} _aggregateRootsBuilder - The {@link AggregateRootsBuilder}.
     * @param {IFilterProcessor[]} _eventFilters - The built event filters.
     * @param {EventsHandlingInternal.EventHandlerProcessor[]} _eventHandlers - The built event handlers.
     * @param {ProjectionAssociations} _projectionsAssociations - The {@link ProjectionAssociations}.
     * @param {ProjectionsInternal.ProjectionProcessor<any>[]} _projections - The built projections.
     * @param {EmbeddingsInternal.EmbeddingProcessor<any>[]} _embeddings - The built embeddings.
     * @param {TenantWithSubscriptions[]} _subscriptions - The built event horizon subscriptions.
     * @param {SubscriptionCallbacks} _subscriptionCallbacks - The built event horizon subscription callbacks.
     */
    constructor(
        private readonly _serviceProviderBuilder: IServiceProviderBuilder,
        private readonly _setupResults: ClientSetup.ClientBuildResults,
        readonly eventTypes: IEventTypes,
        private readonly _aggregateRootsBuilder: AggregateRootsBuilder,
        private readonly _eventFilters: IFilterProcessor[],
        private readonly _eventHandlers: EventsHandlingInternal.EventHandlerProcessor[],
        private readonly _projectionsAssociations: ProjectionAssociations,
        private readonly _projections: ProjectionsInternal.ProjectionProcessor<any>[],
        private readonly _embeddings: EmbeddingsInternal.EmbeddingProcessor<any>[],
        private readonly _subscriptions: TenantWithSubscriptions[],
        private readonly _subscriptionCallbacks: SubscriptionCallbacks,
        ) {
            super();
        }

    /** @inheritdoc */
    get connected(): boolean {
        return this._connected;
    }

    /** @inheritdoc */
    get eventStore(): IEventStoreBuilder {
        return this.throwIfNotConnectedOrUndefined(this._eventStore, 'eventStore');
    }

    /** @inheritdoc */
    get aggregates(): IAggregatesBuilder {
        return this.throwIfNotConnectedOrUndefined(this._aggregates, 'aggregates');
    }

    /** @inheritdoc */
    get projections(): IProjectionStoreBuilder {
        return this.throwIfNotConnectedOrUndefined(this._projectionStore, 'projections');
    }

    /** @inheritdoc */
    get embeddings(): IEmbeddings {
        return this.throwIfNotConnectedOrUndefined(this._embeddingStore, 'embeddings');
    }

    /** @inheritdoc */
    get tenants(): Tenant[] {
        return this._tenants.slice();
    }

    /** @inheritdoc */
    get resources(): IResourcesBuilder {
        return this.throwIfNotConnectedOrUndefined(this._resources, 'resources');
    }

    /** @inheritdoc */
    get eventHorizons(): IEventHorizons {
        return this.throwIfNotConnectedOrUndefined(this._eventHorizons, 'eventHorizons');
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

    /** @inheritdoc */
    async disconnect(cancellation?: Cancellation): Promise<void> {
        this._cancellationSource?.cancel();
        // TODO: Wait for processors to complete.
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
            this._serviceProviderBuilder.addServices(bindings => bindings.bind('logger').toInstance(logger));

            this._setupResults.writeTo(logger);

            const clients = this.createGrpcClients(configuration.runtimeHost, configuration.runtimePort);

            const executionContext = await this.performHandshake(clients.handshake, configuration.version, cancellation);

            const tenants = new TenancyInternal.Tenants(clients.tenants, executionContext, logger);
            this._tenants = await tenants.getAll();
            const tenantIds = this._tenants.map(_ => _.id);

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
                logger,
                this._cancellationSource.cancellation);

            const services = this.buildServiceProviders(tenantIds);

            this.startReverseCallClients(
                clients.filters,
                clients.eventHandlers,
                clients.projections,
                clients.embeddings,
                clients.eventHorizons,
                executionContext,
                services,
                logger,
                this._cancellationSource.cancellation);

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
        this._eventStore = new EventStoreBuilder(
            eventStoreClient,
            this.eventTypes,
            executionContext,
            logger);
        // TODO: Clean up these bindings.
        this._serviceProviderBuilder.addTenantServices((binder, tenant) => binder.bind(IEventStore).toFactory(() => this._eventStore!.forTenant(tenant)));

        this._aggregates = new AggregatesBuilder(
            this._eventStore,
            this.eventTypes,
            logger);

        this._projectionStore = new ProjectionStoreBuilder(
            projectionStoreClient,
            executionContext,
            this._projectionsAssociations,
            logger);

        this._embeddingStore = new Embeddings(
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

    private buildServiceProviders(tenants: TenantId[]): ITenantServiceProviders {
        // TODO: Allow providing one from the configuration
        const baseProvider = new DependencyInversion.DefaultServiceProvider();
        return new DependencyInversion.TenantServiceProviders(baseProvider, this._serviceProviderBuilder, tenants);
    }

    private registerTypes(
        eventTypesClient: EventTypesClient,
        aggregateRootsClient: AggregateRootsClient,
        executionContext: ExecutionContext,
        logger: Logger,
        cancellation: Cancellation,
    ) {
        const eventTypes = new EventTypesInternal.EventTypes(
            eventTypesClient,
            executionContext,
            logger);
        eventTypes.registerAllFrom(this.eventTypes, cancellation);

        const aggregateRoots = new AggregatesInternal.AggregateRoots(
            aggregateRootsClient,
            executionContext,
            logger);
        this._aggregateRootsBuilder.buildAndRegister(
            aggregateRoots,
            cancellation);
    }

    private startReverseCallClients(
        filtersClient: FiltersClient,
        eventHandlersClient: EventHandlersClient,
        projectionsClient: ProjectionsClient,
        embeddingsClient: EmbeddingsClient,
        subscriptionsClient: SubscriptionsClient,
        executionContext: ExecutionContext,
        services: ITenantServiceProviders,
        logger: Logger,
        cancellation: Cancellation,
    ) {
        const filters = new Filters(filtersClient, executionContext, services, logger);
        for (const filter of this._eventFilters) {
            filters.register(filter, cancellation);
        }

        const eventHandlers = new EventHandlers(eventHandlersClient, executionContext, services, logger);
        for (const eventHandler of this._eventHandlers) {
            eventHandlers.register(eventHandler, cancellation);
        }

        const projections = new Projections(projectionsClient, executionContext, services, logger);
        for (const projection of this._projections) {
            projections.register(projection, cancellation);
        }

        const embeddings = new EmbeddingsInternal.Embeddings(embeddingsClient, executionContext, services, logger);
        for (const embedding of this._embeddings) {
            embeddings.register(embedding, cancellation);
        }

        this._eventHorizons = new EventHorizons(
            subscriptionsClient,
            executionContext,
            this._subscriptions,
            this._subscriptionCallbacks,
            logger,
            cancellation);
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

    private throwIfNotConnectedOrUndefined<TProperty>(value: TProperty | undefined, propertyName: string): TProperty {
        if (!this._connected || value === undefined) {
            throw new CannotUseUnconnectedDolittleClient(propertyName);
        }
        return value;
    }
}
