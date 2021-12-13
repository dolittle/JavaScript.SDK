// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { ScopeId } from '@dolittle/sdk.events';

import { ProjectionId } from '../ProjectionId';
import { getProjectionDecoratedType } from '../Builders/projectionDecorator';
import { IProjectionAssociations } from './IProjectionAssociations';
import { NoProjectionAssociatedWithType } from './NoProjectionAssociatedWithType';
import { NoTypeAssociatedWithProjection } from './NoTypeAssociatedWithProjection';
import { ProjectionAssociation } from './ProjectionAssociation';
import { TypeIsNotAProjection } from './TypeIsNotAProjection';

/**
 * Represents an implementation of {@link IProjectionAssociations}.
 */
export class ProjectionAssociations extends IProjectionAssociations {
    readonly _associationsToType: Map<ProjectionAssociation, Constructor<any>> = new Map();
    readonly _typeToAssociations: Map<Constructor<any>, ProjectionAssociation> = new Map();

    /** @inheritdoc */
    associate<T>(typeOrInstance: Constructor<T> | T): void;
    /** @inheritdoc */
    associate<T>(typeOrInstance: Constructor<T> | T, projection: ProjectionId, scope: ScopeId): void;
    /** @inheritdoc */
    associate<T>(typeOrInstance: Constructor<T> | T, projection?: ProjectionId, scope?: ScopeId) {
        if (projection && typeof typeOrInstance  === 'function') {
            const type = typeOrInstance as Constructor<T>;
            const association = new ProjectionAssociation(projection, scope || ScopeId.default);
            this._associationsToType.set(association, type);
            this._typeToAssociations.set(type, association);
        } else if (typeof typeOrInstance === 'function') {
            const decoratedType = getProjectionDecoratedType(typeOrInstance as Constructor<T>);
            if (decoratedType === undefined) {
                throw new TypeIsNotAProjection(typeOrInstance);
            }
            this.associate(decoratedType.type, decoratedType.projectionId, decoratedType.scopeId);
        } else {
            this.associate(Object.getPrototypeOf(typeOrInstance).constructor as Constructor<T>);
        }
    }

    /** @inheritdoc */
    getFor<T>(type: Constructor<T>) {
        const association = this._typeToAssociations.get(type);
        if (!association) {
            throw new NoProjectionAssociatedWithType(type);
        }
        return association;
    }

    /** @inheritdoc */
    getType(projection: ProjectionId, scope: ScopeId) {
        const type = this._associationsToType.get(new ProjectionAssociation(projection, scope));
        if (!type) {
            throw new NoTypeAssociatedWithProjection(projection, scope);
        }
        return type;
    }
}
