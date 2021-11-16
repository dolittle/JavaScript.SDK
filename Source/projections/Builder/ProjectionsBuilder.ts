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

export class ProjectionsBuilder {
    private _projectionBuilders: ICanBuildAndRegisterAProjection[] = [];

    constructor(private _projectionAssociations: IProjectionAssociations) {}

    /**
     * Start building a projection.
     * @param {ProjectionId | Guid | string} projectionId - The unique identifier of the projection.
     * @returns {ProjectionBuilder}
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
    /**
     * Register an instance as an event handler.
     * @param instance - The instance to register as an event handler.
     */
    register<T = any>(instance: T): ProjectionsBuilder;
    register<T = any>(typeOrInstance: Constructor<T> | T): ProjectionsBuilder {
        this._projectionBuilders.push(new ProjectionClassBuilder<T>(typeOrInstance));
        this._projectionAssociations.associate<T>(typeOrInstance);
        return this;
    }

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
