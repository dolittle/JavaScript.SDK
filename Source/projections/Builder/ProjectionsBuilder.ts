// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { ProjectionId } from '../ProjectionId';
import { ICanBuildAndRegisterAProjection } from './ICanBuildAndRegisterAProjection';
import { ProjectionBuilder } from './ProjectionBuilder';

export type ProjectionsBuilderCallback = (builder: ProjectionsBuilderCallback) => void;

export class ProjectionsBuilder {
    private _projectionBuilders: ICanBuildAndRegisterAProjection[] = [];

    /**
     * Start building a projection.
     * @param {ProjectionId | Guid | string} projectionId  The unique identifier of the projection
     * @returns 
     */
    createProjection(projectionId: ProjectionId | Guid | string): ProjectionBuilder {
        const builder = new ProjectionBuilder(ProjectionId.from(projectionId));
        this._projectionBuilders.push(builder);
        return builder;
    }

    /**
     * Register a type as a projection
     * @param type The type to register as a projection.
     */
    // register<T = any>(type: Constructor<T>): ProjectionsBuilder;
    /**
     * Register an instance as an event handler.
     * @param instance The instance to register as an event handler.
     */
    // register<T = any>(instance: T): ProjectionsBuilder;
    // register<T = any>(typeOrInstance: Constructor<T> | T): ProjectionsBuilder {
    //     this._projectionBuilders.push(new EventHandlerClassBuilder(typeOrInstance));
    //     return this;
    // }

}
