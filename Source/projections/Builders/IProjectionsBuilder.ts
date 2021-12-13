// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { ProjectionId } from '../ProjectionId';
import { IProjectionBuilder } from './IProjectionBuilder';

/**
 * Defines a builder for building projections.
 */
export abstract class IProjectionsBuilder {
    /**
     * Start building a projection.
     * @param {ProjectionId | Guid | string} projectionId - The unique identifier of the projection.
     * @returns {IProjectionsBuilder} The projections builder for continuation.
     */
    abstract createProjection(projectionId: ProjectionId | Guid | string): IProjectionBuilder;

    /**
     * Register a type as a projection.
     * @param type - The type to register as a projection.
     */
    abstract registerProjection<T = any>(type: Constructor<T>): IProjectionsBuilder;

    /**
     * Register an instance as a projection.
     * @param instance - The instane to register as a projection.
     */
    abstract registerProjection<T = any>(instance: T): IProjectionsBuilder;
}
