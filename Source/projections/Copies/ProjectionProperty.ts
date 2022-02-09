// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs, createIsConceptAsString } from '@dolittle/concepts';

/**
 * Defines the types that can be converted into a {@link ProjectionProperty}.
 */
export type ProjectionPropertyLike = string | ProjectionProperty;

/**
 * Represents a field of a projection read model.
 */
export class ProjectionProperty extends ConceptAs<string, '@dolittle/sdk.projections.Copies.ProjectionProperty'> {
    /**
     * Initialises a new instance of the {@link ProjectionField} class.
     * @param {string} field - The projection field.
     */
    constructor(field: string) {
        super(field, '@dolittle/sdk.projections.Copies.ProjectionProperty');
    }

    /**
     * Creates a {@link ProjectionProperty} from a {@link string}.
     * @param {ProjectionPropertyLike} property - The projection field.
     * @returns {ProjectionProperty} The created projection field concept.
     */
    static from(property: ProjectionPropertyLike): ProjectionProperty {
        if (isProjectionProperty(property)) return property;
        return new ProjectionProperty(property);
    }
}

/**
 * Checks whether or not an object is an instance of {@link ProjectionProperty}.
 * @param {any} object - The object to check.
 * @returns {boolean} True if the object is an {@link ProjectionProperty}, false if not.
 */
export const isProjectionProperty = createIsConceptAsString(ProjectionProperty, '@dolittle/sdk.projections.Copies.ProjectionProperty');
