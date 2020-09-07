// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ChannelCredentials } from 'grpc';
import { ArtifactsBuilder, ArtifactsBuilderCallback, IArtifacts } from '@dolittle/sdk.artifacts';
import { EventHandlersBuilder, EventHandlersBuilderCallback, IEventHandlers, eventHandler } from '@dolittle/sdk.events.handling';
import { EventFiltersBuilder, EventFiltersBuilderCallback, IFilters } from '@dolittle/sdk.events.filtering';
import { EventHandlersClient } from '@dolittle/runtime.contracts/Runtime/Events.Processing/EventHandlers_grpc_pb';
import { IContainer } from '@dolittle/sdk.common';
import { IExecutionContextManager } from '@dolittle/sdk.execution';
import { Logger } from 'winston';
import { Cancellation } from '@dolittle/sdk.resilience';
import { FiltersClient } from '@dolittle/runtime.contracts/Runtime/Events.Processing/Filters_grpc_pb';

export type EventStoreBuilderCallback = (builder: EventStoreBuilder) => void;

/**
 * Represents a builder for building event types, event handlers and event filters.
 */
export class EventStoreBuilder {
    private _artifactsBuilder: ArtifactsBuilder = new ArtifactsBuilder();
    private _eventHandlersBuilder: EventHandlersBuilder = new EventHandlersBuilder();
    private _eventFiltersBuilder: EventFiltersBuilder = new EventFiltersBuilder();

    /**
     * Configure event types through the artifacts builder.
     * @param {ArtifactsBuilderCallback} callback The builder callback.
     * @returns {ClientBuilder} The client builder for continuation.
     */
    withEventTypes(callback: ArtifactsBuilderCallback): EventStoreBuilder {
        callback(this._artifactsBuilder);
        return this;
    }

    /**
     * Configure event handlers through the event handlers builder.
     * @param {EventHandlersBuilderCallback} callback The builder callback.
     * @returns {ClientBuilder} The client builder for continuation.
     */
    withEventHandlers(callback: EventHandlersBuilderCallback): EventStoreBuilder {
        callback(this._eventHandlersBuilder);
        return this;
    }

    /**
     * Configure event filters through the event filters builder.
     * @param {EventFiltersBuilderCallback} callback The builder callback.
     * @returns {ClientBuilder} The client builder for continuation.
     */
    withFilters(callback: EventFiltersBuilderCallback): EventStoreBuilder {
        callback(this._eventFiltersBuilder);
        return this;
    }

    /**
     * Builds all artifacts, eventhandlers and filters and returns them as a tuple.
     * @param {string} connectionString A string of 'host:port'.
     * @param {ChannelCredentials} credentials grpc credentials.
     * @param {IContainer} container An IoC container.
     * @param {IExecutionContextManager} executionContextManager Execution context manager.
     * @param {Logger} logger For logging.
     * @param {Cancellation} cancellation A cancellation token.
     */
    build(
        connectionString: string,
        credentials: ChannelCredentials,
        container: IContainer,
        executionContextManager: IExecutionContextManager,
        logger: Logger,
        cancellation: Cancellation): [IArtifacts, IEventHandlers, IFilters] {
        const artifacts = this.buildEventTypes();

        const eventHandlersClient = new EventHandlersClient(connectionString, credentials);
        const eventHandlers = this.buildEventHandlers(
            eventHandlersClient,
            container,
            executionContextManager,
            artifacts,
            logger,
            cancellation
        );

        const filtersClient = new FiltersClient(connectionString, credentials);
        const filters = this.buildFilters(
            filtersClient,
            executionContextManager,
            artifacts,
            logger,
            cancellation
        );
        return [artifacts, eventHandlers, filters];
    }

    /**
     * Build an artifacts instance.
     * @returns {IArtifacts} Artifacts to work with.
     */
    private buildEventTypes() {
        return this._artifactsBuilder.build();
    }

    /**
     * Builds an instance for holding event handlers.
     * @returns {IEventHandlers} New instance.
     */
    private buildEventHandlers(
        client: EventHandlersClient,
        container: IContainer,
        executionContextManager: IExecutionContextManager,
        artifacts: IArtifacts,
        logger: Logger,
        cancellation: Cancellation): IEventHandlers {
            return this._eventHandlersBuilder.build(client, container, executionContextManager, artifacts, logger, cancellation);
    }

    /**
     * Builds all the event filters.
     * @param {FiltersClient} client The gRPC client for filters.
     * @param {IExecutionContextManager} executionContextManager Execution context manager.
     * @param {IArtifacts} artifacts For artifacts resolution.
     * @param {Logger} logger For logging.
     */
    private buildFilters(
        client: FiltersClient,
        executionContextManager: IExecutionContextManager,
        artifacts: IArtifacts,
        logger: Logger,
        cancellation: Cancellation): IFilters {
            return this._eventFiltersBuilder.build(client, executionContextManager, artifacts, logger, cancellation);
    }
}
