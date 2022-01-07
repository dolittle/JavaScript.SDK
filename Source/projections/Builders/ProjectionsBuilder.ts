// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { IClientBuildResults, IModelBuilder } from '@dolittle/sdk.common';

import { ProjectionId } from '../ProjectionId';
import { ProjectionBuilder } from './ProjectionBuilder';
import { ProjectionClassBuilder } from './ProjectionClassBuilder';
import { projection as projectionDecorator, isDecoratedProjectionType, getDecoratedProjectionType } from './projectionDecorator';
import { IProjectionsBuilder } from './IProjectionsBuilder';
import { IProjectionBuilder } from './IProjectionBuilder';
import { ProjectionModelId } from '../ProjectionModelId';

/**
 * Represents an implementation of {@link IProjectionsBuilder}.
 */
export class ProjectionsBuilder extends IProjectionsBuilder {
    /**
     * Initialises a new instance of the {@link ProjectionsBuilder} class.
     * @param {IModelBuilder} _modelBuilder - For binding projections to identifiers.
     * @param {IClientBuildResults} _buildResults - For keeping track of build results.
     */
    constructor(
        private readonly _modelBuilder: IModelBuilder,
        private readonly _buildResults: IClientBuildResults
    ) {
        super();
    }

    /** @inheritdoc */
    createProjection(projectionId: string | ProjectionId | Guid): IProjectionBuilder {
        const identifier = ProjectionId.from(projectionId);
        return new ProjectionBuilder(identifier, this._modelBuilder);
    }

    /** @inheritdoc */
    registerProjection<T = any>(type: Constructor<T>): IProjectionsBuilder {
        if (!isDecoratedProjectionType(type)) {
            this._buildResults.addFailure(`The projection class ${type.name} is not decorated as an projection`,`Add the @${projectionDecorator.name} decorator to the class`);
            return this;
        }

        const projectionType = getDecoratedProjectionType(type);
        const identifier = new ProjectionModelId(projectionType.projectionId, projectionType.scopeId);
        const builder = new ProjectionClassBuilder<T>(projectionType);
        this._modelBuilder.bindIdentifierToType(identifier, type);
        this._modelBuilder.bindIdentifierToProcessorBuilder(identifier, builder);
        return this;
    }
}
