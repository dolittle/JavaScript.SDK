// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { ITypeMap } from '@dolittle/sdk.artifacts';
import { ScopeId } from '@dolittle/sdk.events';

import { ProjectionId } from '../ProjectionId';
import { ScopedProjectionId } from './ScopedProjectionId';

/**
 * Defines a system for working with projection read model types associated with projections.
 */
export abstract class IProjectionReadModelTypes extends ITypeMap<ScopedProjectionId> {
    /**
     * Check if there is a type associated with a given projection.
     * @param {ScopedProjectionId} projection - Projection to check for.
     * @returns {boolean} True if there is, false if not.
     */
    abstract hasTypeFor(projection: ScopedProjectionId): boolean;
    /**
     * Check if there is a type associated with a given projection.
     * @param {ProjectionId} projection - Projection id to check for.
     * @param {ScopeId} scope - Scope id to check for.
     * @returns {boolean} True if there is, false if not.
     */
    abstract hasTypeFor(projection: ProjectionId, scope: ScopeId): boolean;

    /**
     * Get the type associated with a given projection.
     * @param {ScopedProjectionId} projection - Projection to get type for.
     * @returns {Constructor<any>} The type associated with the projection.
     */
    abstract getTypeFor(projection: ScopedProjectionId): Constructor<any>;
    /**
     * Get the type associated with a given projection.
     * @param {ProjectionId} projection - Projection id to get for.
     * @param {ScopeId} scope - Scope id to get for.
     * @returns {Constructor<any>} The type associated with the projection.
     */
    abstract getTypeFor(projection: ProjectionId, scope: ScopeId): Constructor<any>;

    /**
     * Resolves a projection from optional input or the given object.
     * @param {any} object - Object to resolve for.
     * @param {ScopedProjectionId} [projection] - Optional input projection.
     * @returns {ScopedProjectionId} Resolved projection.
     */
    abstract resolveFrom(object: any, projection?: ScopedProjectionId): ScopedProjectionId;
    /**
     * Resolves a projection from optional input or the given object.
     * @param {any} object - Object to resolve for.
     * @param {ProjectionId} [projection] - Optional input projection id.
     * @param {ScopeId} [scope] - Optional input scope id.
     * @returns {ScopedProjectionId} Resolved projection.
     */
    abstract resolveFrom(object: any, projection?: ProjectionId, scope?: ScopeId): ScopedProjectionId;

    /**
     * Associate a type with a projection.
     * @param {Constructor} type - The type to associate.
     * @param {ScopedProjectionId} projection - The projection to associate with.
     */
    abstract associate(type: Constructor<any>, projection: ScopedProjectionId): void;
    /**
     * Associate a type with a projection.
     * @param {Constructor} type - The type to associate.
     * @param {ProjectionId} projection - The projection id to associate with.
     * @param {ScopeId} scope - The scope id to associate with.
     */
    abstract associate(type: Constructor<any>, projection: ProjectionId, scope: ScopeId): void;
}
