// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs, createIsConceptAsString } from '@dolittle/concepts';

/**
 * Defines the types that can be converted into a {@link ProjectionField}.
 */
export type ProjectionFieldLike = string | ProjectionField;

/**
 * Represents a field of a projection read model.
 */
export class ProjectionField extends ConceptAs<string, '@dolittle/sdk.projections.Copies.ProjectionField'> {
    /**
     * Initialises a new instance of the {@link ProjectionField} class.
     * @param {string} field - The projection field.
     */
    constructor(field: string) {
        super(field, '@dolittle/sdk.projections.Copies.ProjectionField');
    }

    /**
     * Creates a {@link ProjectionField} from a {@link string}.
     * @param {ProjectionFieldLike} field - The projection field.
     * @returns {ProjectionField} The created projection field concept.
     */
    static from(field: ProjectionFieldLike): ProjectionField {
        if (isProjectionField(field)) return field;
        return new ProjectionField(field);
    }
}

/**
 * Checks whether or not an object is an instance of {@link ProjectionField}.
 * @param {any} object - The object to check.
 * @returns {boolean} True if the object is an {@link ProjectionField}, false if not.
 */
export const isProjectionField = createIsConceptAsString(ProjectionField, '@dolittle/sdk.projections.Copies.ProjectionField');
