// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { IClientBuildResults } from '@dolittle/sdk.common/ClientSetup';
import { IEventTypes } from '@dolittle/sdk.events';

import { IProjection, ProjectionId } from '..';
import { ProjectionProcessor } from '../Internal';
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
     */
    constructor(private _projectionAssociations: IProjectionAssociations) {
        super();
    }

    /** @inheritdoc */
    createProjection(projectionId: string | ProjectionId | Guid): IProjectionBuilder {
        const builder = new ProjectionBuilder(ProjectionId.from(projectionId), this._projectionAssociations);
        this._callbackBuilders.push(builder);
        return builder;
    }

    /** @inheritdoc */
    register<T = any>(type: Constructor<T>): IProjectionsBuilder;
    register<T = any>(instance: T): IProjectionsBuilder;
    register<T = any>(typeOrInstance: Constructor<T> | T): ProjectionsBuilder {
        this._classBuilders.push(new ProjectionClassBuilder<T>(typeOrInstance));
        this._projectionAssociations.associate<T>(typeOrInstance);
        return this;
    }

    /**
     * Builds all projections created with the builder.
     * @param {IEventTypes} eventTypes - All the registered event types.
     * @param {IClientBuildResults} results - For keeping track of build results.
     * @returns {ProjectionProcessor[]} The built projection processors.
     */
    build(
        eventTypes: IEventTypes,
        results: IClientBuildResults
    ): ProjectionProcessor<any>[] {
        const projections: IProjection<any>[] = [];

        for (const projectionBuilder of this._callbackBuilders) {
            const projection = projectionBuilder.build(eventTypes, results);
            if (projection !== undefined) {
                projections.push(projection);
            }
        }
        for (const projectionBuilder of this._classBuilders) {
            const projection = projectionBuilder.build(eventTypes, results);
            if (projection !== undefined) {
                projections.push(projection);
            }
        }

        return projections.map(projection =>
            new ProjectionProcessor(projection, eventTypes));
    }
}
