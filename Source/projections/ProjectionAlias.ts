// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs, createIsConceptAsString } from '@dolittle/concepts';

/**
 * Defines the types that can be converted to an {@link ProjectionAlias}.
 */
export type ProjectionAliasLike = string | ProjectionAlias;

/**
 * Represents the alias for a Projection.
 */
export class ProjectionAlias extends ConceptAs<string, '@dolittle/sdk.projections.ProjectionAlias'> {
    /**
     * Initialises a new instance of the {@link ProjectionAlias} class.
     * @param {string} alias - The event handler alias.
     */
    constructor(alias: string) {
        super(alias, '@dolittle/sdk.projections.ProjectionAlias');
    }

    /**
     * Creates an {@link ProjectionAlias} from an {@link ProjectionAlias}.
     * @param {ProjectionAliasLike} alias - The projection alias.
     * @returns {ProjectionAlias} The created projection alias concept.
     */
    static from(alias: ProjectionAliasLike): ProjectionAlias {
        if (isProjectionAlias(alias)) return alias;
        return new ProjectionAlias(alias);
    }
}

/**
 * Checks whether or not an object is an instance of {@link ProjectionAlias}.
 * @param {any} object - The object to check.
 * @returns {boolean} True if the object is an {@link ProjectionAlias}, false if not.
 */
export const isProjectionAlias = createIsConceptAsString(ProjectionAlias, '@dolittle/sdk.projections.ProjectionAlias');
