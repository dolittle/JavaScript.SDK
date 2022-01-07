// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { createIsModelIdentifier, ModelIdentifier } from '@dolittle/sdk.common';
import { isScopeId, ScopeId } from '@dolittle/sdk.events';

import { ProjectionId, isProjectionId } from './ProjectionId';

/**
 * Represents the identifier of a projection in an application model.
 */
export class ProjectionModelId extends ModelIdentifier<ProjectionId, '@dolittle/sdk.projections.ProjectionModelId', { scope: ScopeId }> {
    /**
     * Initialises a new instance of the {@link ProjectionModelId} class.
     * @param {ProjectionId} id - The projection id.
     * @param {ScopeId} scope - The scope id.
     */
    constructor(id: ProjectionId, scope: ScopeId) {
        super(id, '@dolittle/sdk.projections.ProjectionModelId', { scope });
    }

    /**
     * Get the scope of the identifier.
     */
    get scope(): ScopeId {
        return this.__extras.scope;
    }
}

/**
 * Checks whether or not an object is an instance of {@link ProjectionModelId}.
 * @param {any} object - The object to check.
 * @returns {boolean} True if the object is an {@link ProjectionModelId}, false if not.
 */
export const isProjectionModelId = createIsModelIdentifier(
    ProjectionModelId,
    isProjectionId,
    '@dolittle/sdk.projections.ProjectionModelId',
    { scope: isScopeId });
