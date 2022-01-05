// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { IdentifierTypeMap } from '@dolittle/sdk.artifacts';
import { ScopeId } from '@dolittle/sdk.events';

import { ProjectionId } from '../ProjectionId';
import { CannotHaveMultipleScopedProjectionIdsAssociatedWithType } from './CannotHaveMultipleScopedProjectionIdsAssociatedWithType';
import { CannotHaveMultipleTypesAssociatedWithScopedProjectionId } from './CannotHaveMultipleTypesAssociatedWithScopedProjectionId';
import { IProjectionReadModelTypes } from './IProjectionReadModelTypes';
import { ScopedProjectionId } from './ScopedProjectionId';
import { ScopedProjectionIdNotAssociatedToAType } from './ScopedProjectionIdNotAssociatedToAType';
import { TypeNotAssociatedToScopedProjectionId } from './TypeNotAssociatedToScopedProjectionId';

/**
 * Represents an implementation of {@link IProjectionReadModelTypes}.
 */
export class ProjectionReadModelTypes extends IProjectionReadModelTypes {
    private readonly _scopesById: IdentifierTypeMap<ProjectionId, IdentifierTypeMap<ScopeId, Constructor<any>>> = new IdentifierTypeMap<ProjectionId, IdentifierTypeMap<ScopeId, Constructor<any>>>();

    /** @inheritdoc */
    getAll(): ScopedProjectionId[] {
        const scopedIdentifiers: ScopedProjectionId[] = [];

        for (const [projectionId, scopes] of this._scopesById.entries()) {
            for (const scopeId of scopes.keys()) {
                scopedIdentifiers.push(new ScopedProjectionId(projectionId, scopeId));
            }
        }

        return scopedIdentifiers;
    }

    /** @inheritdoc */
    hasTypeFor(projectionId: ProjectionId, scopeId: ScopeId): boolean {
        if (!this._scopesById.has(projectionId)) return false;
        return this._scopesById.get(projectionId)!.has(scopeId);
    }

    /** @inheritdoc */
    getTypeFor(projectionId: ProjectionId, scopeId: ScopeId): Constructor<any> {
        if (this._scopesById.has(projectionId)) {
            if (this._scopesById.get(projectionId)!.has(scopeId)) {
                return this._scopesById.get(projectionId)!.get(scopeId)!;
            }
        }

        throw new ScopedProjectionIdNotAssociatedToAType(new ScopedProjectionId(projectionId, scopeId));
    }

    /** @inheritdoc */
    hasFor(type: Constructor<any>): boolean {
        for (const [_, scopes] of this._scopesById.entries()) {
            for (const [_, associatedType] of scopes.entries()) {
                if (associatedType === type) {
                    return true;
                }
            }
        }
        return false;
    }

    /** @inheritdoc */
    getFor(type: Constructor<any>): ScopedProjectionId {
        for (const [projectionId, scopes] of this._scopesById.entries()) {
            for (const [scopeId, associatedType] of scopes.entries()) {
                if (associatedType === type) {
                    return new ScopedProjectionId(projectionId, scopeId);
                }
            }
        }

        throw new TypeNotAssociatedToScopedProjectionId(type);
    }

    /** @inheritdoc */
    associate(type: Constructor<any>, projectionId: ProjectionId, scopeId: ScopeId): void {
        this.throwIfMultipleIdentifiersAssociatedWithType(type, projectionId, scopeId);
        this.throwIfMultipleTypesAssociatedWithIdentifier(projectionId, scopeId, type);

        if (this._scopesById.has(projectionId)) {
            this._scopesById.get(projectionId)!.set(scopeId, type);
        } else {
            const scopes = new IdentifierTypeMap<ScopeId, Constructor<any>>();
            scopes.set(scopeId, type);
            this._scopesById.set(projectionId, scopes);
        }
    }

    private throwIfMultipleIdentifiersAssociatedWithType(type: Constructor<any>, projectionId: ProjectionId, scopeId: ScopeId) {
        if (this.hasFor(type)) {
            throw new CannotHaveMultipleScopedProjectionIdsAssociatedWithType(type, new ScopedProjectionId(projectionId, scopeId), this.getFor(type));
        }
    }

    private throwIfMultipleTypesAssociatedWithIdentifier(projectionId: ProjectionId, scopeId: ScopeId, type: Constructor<any>) {
        if (this.hasTypeFor(projectionId, scopeId)) {
            throw new CannotHaveMultipleTypesAssociatedWithScopedProjectionId(new ScopedProjectionId(projectionId, scopeId), type, this.getTypeFor(projectionId, scopeId));
        }
    }
}
