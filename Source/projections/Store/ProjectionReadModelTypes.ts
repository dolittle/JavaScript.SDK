// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { ScopeId } from '@dolittle/sdk.events';

import { ProjectionId } from '../ProjectionId';
import { IProjectionReadModelTypes } from './IProjectionReadModelTypes';
import { ScopedProjectionId } from './ScopedProjectionId';
import { TypeMap } from '@dolittle/sdk.artifacts';

/**
 * Represents an implementation of {@link IProjectionReadModelTypes}.
 */
export class ProjectionReadModelTypes extends TypeMap<ScopedProjectionId, [string, string]> implements IProjectionReadModelTypes {
    /**
     * Initialises a new instance of the {@link ProjectionReadModelTypes} class.
     */
    constructor() {
        super(ScopedProjectionId, _ => [_.projectionId.value.toString(), _.scopeId.value.toString()], 2);
    }

    /** @inheritdoc */
    hasTypeFor(projection: ScopedProjectionId | ProjectionId, scope?: ScopeId): boolean {
        if (scope !== undefined) {
            return super.hasTypeFor(new ScopedProjectionId(projection as ProjectionId, scope));
        }
        return super.hasTypeFor(projection as ScopedProjectionId);
    }

    /** @inheritdoc */
    getTypeFor(projection: ScopedProjectionId | ProjectionId, scope?: ScopeId): Constructor<any> {
        if (scope !== undefined) {
            return super.getTypeFor(new ScopedProjectionId(projection as ProjectionId, scope));
        }
        return super.getTypeFor(projection as ScopedProjectionId);
    }

    /** @inheritdoc */
    resolveFrom(object: any, projection?: ScopedProjectionId | ProjectionId, scope?: ScopeId): ScopedProjectionId {
        if (scope !== undefined) {
            return super.resolveFrom(object, new ScopedProjectionId(projection as ProjectionId, scope));
        }
        return super.resolveFrom(object, projection as ScopedProjectionId);
    }

    /** @inheritdoc */
    associate(type: Constructor<any>, projection: ScopedProjectionId | ProjectionId, scope?: ScopeId): void {
        if (scope !== undefined) {
            super.associate(type, new ScopedProjectionId(projection as ProjectionId, scope));
        }
        super.associate(type, projection as ScopedProjectionId);
    }
}
