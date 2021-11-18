// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { Guid } from '@dolittle/rudiments';
import { IEventTypes } from '@dolittle/sdk.events';
import { IContainer } from '@dolittle/sdk.common';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { Constructor } from '@dolittle/types';
import { Cancellation } from '@dolittle/sdk.resilience';

import { ProjectionsClient } from '@dolittle/runtime.contracts/Events.Processing/Projections_grpc_pb';

import { IProjections, ProjectionId, Projections } from '..';

import { ICanBuildAndRegisterAProjection } from './ICanBuildAndRegisterAProjection';
import { ProjectionBuilder } from './ProjectionBuilder';
import { ProjectionClassBuilder } from './ProjectionClassBuilder';
import { IProjectionAssociations } from '../Store/IProjectionAssociations';

/**
 * Represents a builder for building instances of {@link IProjection}.
 */
export class ProjectionsBuilder {
    private _projectionBuilders: ICanBuildAndRegisterAProjection[] = [];

    /**
     * Initialises a new instance of the {@link ProjectionsBuilder} class.
     * @param {IProjectionAssociations} _projectionAssociations - The projection associations to use for associating read model types with projections.
     */
    constructor(private _projectionAssociations: IProjectionAssociations) {}

    /**
     * Start building a projection.
     * @param {ProjectionId | Guid | string} projectionId - The unique identifier of the projection.
     * @returns {ProjectionBuilder} The projections builder for continuation.
     */
    createProjection(projectionId: ProjectionId | Guid | string): ProjectionBuilder {
        const builder = new ProjectionBuilder(ProjectionId.from(projectionId), this._projectionAssociations);
        this._projectionBuilders.push(builder);
        return builder;
    }

    /**
     * Register a type as a projection.
     * @param type - The type to register as a projection.
     */
    register<T = any>(type: Constructor<T>): ProjectionsBuilder;
    register<T = any>(instance: T): ProjectionsBuilder;
    register<T = any>(typeOrInstance: Constructor<T> | T): ProjectionsBuilder {
        this._projectionBuilders.push(new ProjectionClassBuilder<T>(typeOrInstance));
        this._projectionAssociations.associate<T>(typeOrInstance);
        return this;
    }

    /**
     * Builds and registers all projections created with the builder.
     * @param {ProjectionsClient} client - The projections client to use to register the built projections.
     * @param {IContainer} container - The container to use to create new instances of projection types.
     * @param {ExecutionContext} executionContext - The execution context of the client.
     * @param {IEventTypes} eventTypes - All the registered event types.
     * @param {Logger} logger - The logger to use for logging.
     * @param {Cancellation} cancellation - The cancellation token.
     * @returns {Projections} The built projections.
     */
    buildAndRegister(
        client: ProjectionsClient,
        container: IContainer,
        executionContext: ExecutionContext,
        eventTypes: IEventTypes,
        logger: Logger,
        cancellation: Cancellation): IProjections {
        const projections = new Projections(logger);

        for (const projectionBuilder of this._projectionBuilders) {
            projectionBuilder.buildAndRegister(client, projections, container, executionContext, eventTypes, logger, cancellation);
        }

        return projections;
    }
}
