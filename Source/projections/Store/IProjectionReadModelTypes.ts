// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { ScopeId } from '@dolittle/sdk.events';

import { ProjectionId } from '../ProjectionId';
import { ScopedProjectionId } from './ScopedProjectionId';

/**
 * Defines a system for working with projection read model types associated with projections.
 */
export abstract class IProjectionReadModelTypes {
    /**
     * Gets all identifers.
     * @returns {ScopedProjectionId[]} All identifiers associated with a type.
     */
    abstract getAll(): ScopedProjectionId[];

    /**
     * Check if there is a type associated with a projection and scope identifier.
     * @param {ProjectionId} projectionId - Projection identifier.
     * @param {ScopeId} scopeId - Scope identifier.
     * @returns {boolean} True if there is, false if not.
     */
    abstract hasTypeFor(projectionId: ProjectionId, scopeId: ScopeId): boolean;

    /**
     * Get type for a given projection and scope identifier.
     * @param {ProjectionId} projectionId - Projection identifier.
     * @param {ScopeId} scopeId - Scope identifier.
     * @returns {Constructor<any>} Type for identifier.
     */
    abstract getTypeFor(projectionId: ProjectionId, scopeId: ScopeId): Constructor<any>;

    /**
     * Check if there is a projection and scope identifier associated with a given type.
     * @param {Constructor<any>} type - Type to check for.
     * @returns {boolean} True if there is, false if not.
     */
    abstract hasFor(type: Constructor<any>): boolean;

    /**
     * Get the projection and scope identifier associated with a given type.
     * @param {Constructor<any>} type - Type to get for.
     * @returns {ScopedProjectionId} The identifier associated.
     */
    abstract getFor(type: Constructor<any>): ScopedProjectionId;

    /**
     * Associate a type with an identifier.
     * @param {Constructor<any>} type - Type to associate.
     * @param {ProjectionId} projectionId - Projection identifier to associate with.
     * @param {ScopeId} scopeId - Scope identifier to associate with.
     */
    abstract associate(type: Constructor<any>, projectionId: ProjectionId, scopeId: ScopeId): void;
}
