// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { IClientBuildResults } from '@dolittle/sdk.common/ClientSetup';
import { IEventTypes, ScopeId } from '@dolittle/sdk.events';

import { IProjection, IProjectionAssociations, ProjectionId } from '../';
import { IProjectionBuilder } from './IProjectionBuilder';
import { IProjectionBuilderForReadModel } from './IProjectionBuilderForReadModel';
import { ProjectionBuilderForReadModel } from './ProjectionBuilderForReadModel';
import { ReadModelAlreadyDefinedForProjection } from './ReadModelAlreadyDefinedForProjection';

/**
 * Represents an implementation of {@link IProjectionBuilder}.
 */
export class ProjectionBuilder extends IProjectionBuilder {
    private _scopeId: ScopeId = ScopeId.default;
    private _readModelTypeOrInstance?: Constructor<any> | any;
    private _builder?: ProjectionBuilderForReadModel<any>;

    /**
     * Initializes a new instance of {@link ProjectionBuilder}.
     * @param {ProjectionId} _projectionId - The unique identifier of the projection to build for.
     * @param {IProjectionAssociations} _projectionAssociations - The projection associations to use for associating read model types with projections.
     */
    constructor(
        private readonly _projectionId: ProjectionId,
        private readonly _projectionAssociations: IProjectionAssociations
    ) {
        super();
    }

    /** @inheritdoc */
    inScope(scopeId: string | ScopeId | Guid): IProjectionBuilder {
        this._scopeId = ScopeId.from(scopeId);
        if (this._builder !== undefined) {
            this._builder.inScope(scopeId);
        }
        return this;
    }

    /** @inheritdoc */
    forReadModel<T>(typeOrInstance: T | Constructor<T>): IProjectionBuilderForReadModel<T> {
        if (this._readModelTypeOrInstance) {
            throw new ReadModelAlreadyDefinedForProjection(this._projectionId, typeOrInstance, this._readModelTypeOrInstance);
        }
        this._readModelTypeOrInstance = typeOrInstance;
        this._builder = new ProjectionBuilderForReadModel(this._projectionId, typeOrInstance, this._scopeId);

        this._projectionAssociations.associate<T>(this._readModelTypeOrInstance, this._projectionId, this._scopeId);

        return this._builder;
    }

    /**
     * Builds the projection.
     * @param {IEventTypes} eventTypes - For event types resolution.
     * @param {IClientBuildResults} results - For keeping track of build results.
     * @returns {IProjection | undefined} The built projection if successful.
     */
    build(eventTypes: IEventTypes, results: IClientBuildResults): IProjection<any> | undefined {
        if (!this._builder) {
            results.addFailure(`Failed to register projection ${this._projectionId}. No read model defined for projection.`);
            return;
        }
        return this._builder.build(eventTypes, results);
    }
}
