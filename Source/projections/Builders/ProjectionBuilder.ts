// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid, IEquatable } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { IClientBuildResults, IModelBuilder } from '@dolittle/sdk.common';
import { IEventTypes, ScopeId } from '@dolittle/sdk.events';

import { IProjection } from '../IProjection';
import { ProjectionId } from '../ProjectionId';
import { IProjectionBuilder } from './IProjectionBuilder';
import { IProjectionBuilderForReadModel } from './IProjectionBuilderForReadModel';
import { ProjectionBuilderForReadModel } from './ProjectionBuilderForReadModel';
import { ReadModelAlreadyDefinedForProjection } from './ReadModelAlreadyDefinedForProjection';

/**
 * Represents an implementation of {@link IProjectionBuilder}.
 */
export class ProjectionBuilder extends IProjectionBuilder implements IEquatable {
    private _scopeId: ScopeId = ScopeId.default;
    private _readModelTypeOrInstance?: Constructor<any> | any;
    private _builder?: ProjectionBuilderForReadModel<any>;

    /**
     * Initializes a new instance of {@link ProjectionBuilder}.
     * @param {ProjectionId} _projectionId - The unique identifier of the projection to build for.
     * @param {IModelBuilder} _modelBuilder - For binding read models to identifiers.
     */
    constructor(
        private readonly _projectionId: ProjectionId,
        private readonly _modelBuilder: IModelBuilder,
    ) {
        super();
    }

    /** @inheritdoc */
    inScope(scopeId: string | ScopeId | Guid): IProjectionBuilder {
        // TODO: We also need to set the scope in the model identifier.
        this._scopeId = ScopeId.from(scopeId);
        if (this._builder !== undefined) {
            this._builder.inScope(scopeId);
        }
        return this;
    }

    /** @inheritdoc */
    forReadModel<T>(typeOrInstance: T | Constructor<T>): IProjectionBuilderForReadModel<T> {
        if (this._readModelTypeOrInstance !== undefined) {
            throw new ReadModelAlreadyDefinedForProjection(this._projectionId, typeOrInstance, this._readModelTypeOrInstance);
        }
        this._readModelTypeOrInstance = typeOrInstance;

        if (typeOrInstance instanceof Function) {
            this._modelBuilder.bindIdentifierToType(this._projectionId, typeOrInstance);
        }

        this._builder = new ProjectionBuilderForReadModel(this._projectionId, typeOrInstance, this._scopeId);
        return this._builder;
    }

    /** @inheritdoc */
    equals(other: any): boolean {
        return this === other;
    }

    /**
     * Builds the projection.
     * @param {IEventTypes} eventTypes - For event types resolution.
     * @param {IClientBuildResults} results - For keeping track of build results.
     * @returns {IProjection | undefined} The built projection if successful.
     */
    build(eventTypes: IEventTypes, results: IClientBuildResults): IProjection<any> | undefined {
        if (!this._builder) {
            results.addFailure(`Failed to build projection ${this._projectionId}. No read model defined for projection.`);
            return;
        }
        return this._builder.build(eventTypes, results);
    }
}
