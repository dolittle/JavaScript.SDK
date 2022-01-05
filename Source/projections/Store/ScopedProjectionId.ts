// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid, IEquatable } from '@dolittle/rudiments';

import { isScopeId, ScopeId } from '@dolittle/sdk.events';

import { ProjectionId, isProjectionId } from '../ProjectionId';

/**
 * Represents the unique identifier of a Projection in a Scope.
 */
export class ScopedProjectionId implements IEquatable {
    /**
     * Initialises a new instance of the {@link ScopedProjectionId} class.
     * @param {ProjectionId} projectionId - The projection id.
     * @param {ScopeId} scopeId - The scope id.
     */
    constructor(
        readonly projectionId: ProjectionId,
        readonly scopeId: ScopeId,
    ) {}

    /** @inheritdoc */
    equals(other: any): boolean {
        if (!isScopedProjectionId(other)) return false;
        return this.projectionId.equals(other.projectionId) && this.scopeId.equals(other.scopeId);
    }

    /**
     * Creates a {@link ScopedProjectionId} from a projection id and scope id..
     * @param {string | Guid | ProjectionId} projectionId - The projection id.
     * @param {string | Guid | ScopeId} scopeId - The scope id.
     * @returns {ScopedProjectionId} The created scoped projection id.
     */
    static from(projectionId: string | Guid | ProjectionId, scopeId: string | Guid | ScopeId): ScopedProjectionId {
        return new ScopedProjectionId(
            ProjectionId.from(projectionId),
            ScopeId.from(scopeId));
    }
}

/**
 * Checks whether or not an object is an instance of {@link ScopedProjectionId}.
 * @param {any} object - The object to check.
 * @returns {boolean} True if the object is an {@link ScopedProjectionId}, false if not.
 */
export const isScopedProjectionId = (object: any): object is ScopedProjectionId => {
    if (typeof object !== 'object' || object === null) return false;

    const { projectionId, scopeId, equals } = object;
    if (!isProjectionId(projectionId)) return false;
    if (!isScopeId(scopeId)) return false;
    if (typeof equals !== 'function' || equals.length !== 1) return false;

    return true;
};
