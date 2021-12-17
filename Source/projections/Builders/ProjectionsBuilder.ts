// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { IClientBuildResults } from '@dolittle/sdk.common';
import { IEventTypes } from '@dolittle/sdk.events';

import { IProjection } from '../IProjection';
import { ProjectionId } from '../ProjectionId';
import { ProjectionProcessor } from '../Internal/ProjectionProcessor';
import { ProjectionBuilder } from './ProjectionBuilder';
import { ProjectionClassBuilder } from './ProjectionClassBuilder';
import { IProjectionAssociations } from '../Store/IProjectionAssociations';
import { IProjectionsBuilder } from './IProjectionsBuilder';
import { IProjectionBuilder } from './IProjectionBuilder';

/**
 * Represents an implementation of {@link IProjectionsBuilder}.
 */
export class ProjectionsBuilder extends IProjectionsBuilder {
    private _callbackBuilders: ProjectionBuilder[] = [];
    private _classBuilders: ProjectionClassBuilder<any>[] = [];

    /**
     * Initialises a new instance of the {@link ProjectionsBuilder} class.
     * @param {IProjectionAssociations} _projectionAssociations - The projection associations to use for associating read model types with projections.
     * @param {IClientBuildResults} _buildResults - For keeping track of build results.
     */
    constructor(private _projectionAssociations: IProjectionAssociations, private readonly _buildResults: IClientBuildResults) {
        super();
    }

    /** @inheritdoc */
    createProjection(projectionId: string | ProjectionId | Guid): IProjectionBuilder {
        const builder = new ProjectionBuilder(ProjectionId.from(projectionId), this._projectionAssociations);
        this._callbackBuilders.push(builder);
        return builder;
    }

    /** @inheritdoc */
    registerProjection<T = any>(type: Constructor<T>): IProjectionsBuilder;
    registerProjection<T = any>(instance: T): IProjectionsBuilder;
    registerProjection<T = any>(typeOrInstance: Constructor<T> | T): ProjectionsBuilder {
        this._classBuilders.push(new ProjectionClassBuilder<T>(typeOrInstance));
        this._projectionAssociations.associate<T>(typeOrInstance);
        return this;
    }

    /**
     * Builds all projections created with the builder.
     * @param {IEventTypes} eventTypes - All the registered event types.
     * @returns {ProjectionProcessor[]} The built projection processors.
     */
    build(eventTypes: IEventTypes): ProjectionProcessor<any>[] {
        const projections: IProjection<any>[] = [];

        for (const projectionBuilder of this._callbackBuilders) {
            const projection = projectionBuilder.build(eventTypes, this._buildResults);
            if (projection !== undefined) {
                projections.push(projection);
            }
        }
        for (const projectionBuilder of this._classBuilders) {
            const projection = projectionBuilder.build(eventTypes, this._buildResults);
            if (projection !== undefined) {
                projections.push(projection);
            }
        }

        return projections.map(projection =>
            new ProjectionProcessor(projection, eventTypes));
    }
}
