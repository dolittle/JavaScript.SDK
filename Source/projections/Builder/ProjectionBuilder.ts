// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { ProjectionsClient } from '@dolittle/runtime.contracts/Events.Processing/Projections_grpc_pb';
import { IContainer } from '@dolittle/sdk.common';
import { IEventTypes, ScopeId } from '@dolittle/sdk.events';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { Cancellation } from '@dolittle/sdk.resilience';
import { Constructor } from '@dolittle/types';
import { Logger } from 'winston';
import { IProjectionAssociations, IProjections, ProjectionId } from '..';
import { ICanBuildAndRegisterAProjection } from './ICanBuildAndRegisterAProjection';
import { ProjectionBuilderForReadModel } from './ProjectionBuilderForReadModel';
import { ReadModelAlreadyDefinedForProjection } from './ReadModelAlreadyDefinedForProjection';

/**
 *
 */
export class ProjectionBuilder implements ICanBuildAndRegisterAProjection {
    private _scopeId: ScopeId = ScopeId.default;
    private _readModelTypeOrInstance?: Constructor<any> | any;
    private _builder?: ProjectionBuilderForReadModel<any>;

    /**
     * Initializes a new instance of {@link ProjectionBuilder}.
     * @param {ProjectionId} _projectionId - The unique identifier of the projection to build for.
     * @param _projectionAssociations
     */
    constructor(private readonly _projectionId: ProjectionId, private readonly _projectionAssociations: IProjectionAssociations) { }

    /**
     * Defines the projection to operate on a specific {@link ScopeId}.
     * @param {ScopeId | Guid | string} scopeId - Scope the projection operates on.
     * @returns {ProjectionBuilder}
     */
    inScope(scopeId: ScopeId | Guid | string): ProjectionBuilder {
        this._scopeId = ScopeId.from(scopeId);
        return this;
    }

    /**
     * Defines the type of the read model the projection builds. The initial state of a newly
     * created read model is given by the provided instance or an instance constructed by
     * the default constructor of the provided type.
     * @param {Constructor<T> | T} typeOrInstance - The type or an instance of the read model.
     * @returns {ProjectionBuilderForReadModel<T>}
     */
    forReadModel<T>(typeOrInstance: Constructor<T> | T): ProjectionBuilderForReadModel<T> {
        if (this._readModelTypeOrInstance) {
            throw new ReadModelAlreadyDefinedForProjection(this._projectionId, typeOrInstance, this._readModelTypeOrInstance);
        }
        this._readModelTypeOrInstance = typeOrInstance;
        this._builder = new ProjectionBuilderForReadModel(this._projectionId, typeOrInstance, this._scopeId);

        this._projectionAssociations.associate<T>(this._readModelTypeOrInstance, this._projectionId, this._scopeId);

        return this._builder;
    }

    /** @inheritdoc */
    buildAndRegister(
        client: ProjectionsClient,
        projections: IProjections,
        container: IContainer,
        executionContext: ExecutionContext,
        eventTypes: IEventTypes,
        logger: Logger,
        cancellation: Cancellation): void {
        if (!this._builder) {
            logger.warn(`Failed to register projection ${this._projectionId}. No read model defined for projection.`);
            return;
        }
        this._builder.buildAndRegister(
            client,
            projections,
            container,
            executionContext,
            eventTypes,
            logger,
            cancellation);
    }
}
