// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { ProjectionAssociation } from './ProjectionAssociation';

/**
 * Defines a system that can get projections associated with classes.
 */
export abstract class IProjectionAssociations {
    /**
     * Checks whether the class is associated with a projection.
     * @param {Constructor<T>} type - The class of the projection.
     * @returns {boolean} True if the class is associated with a projection, false if not.
     * @template T
     */
    abstract hasFor<T>(type: Constructor<T>): boolean;

    /**
     * Get the projection associated with a class.
     * @param {Constructor<T>} type - The class of the projection.
     * @returns {ProjectionAssociation} The associated projection.
     * @template T
     */
    abstract getFor<T>(type: Constructor<T>): ProjectionAssociation;
}
