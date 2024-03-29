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
     * @returns {IProjectionBuilder} The builder for building the projection.
     */
    abstract create(projectionId: ProjectionId | Guid | string): IProjectionBuilder;

    /**
     * Register a type as a projection.
     * @param type - The type to register as a projection.
     * @returns {IProjectionsBuilder} The projections builder for continuation.
     */
    abstract register<T = any>(type: Constructor<T>): IProjectionsBuilder;
}
