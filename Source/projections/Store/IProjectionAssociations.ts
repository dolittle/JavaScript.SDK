// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ScopeId } from '@dolittle/sdk.events';
import { Constructor } from '@dolittle/types';
import { ProjectionId } from '..';
import { ProjectionAssociation } from './ProjectionAssociation';

export abstract class IProjectionAssociations {

    /**
     * Associate a projection
     * @template T
     * @param {Constructor<T> | T} typeOrInstance The type or instance of the type of the projection.
     */
    abstract associate<T> (typeOrInstance: Constructor<T> | T): void;
    /**
     * Associate a projection.
     * @template T
     * @param {Constructor<T> | T} typeOrInstance The type or instance of the type of the projection.
     * @param {ProjectionId} projection The projections id.
     * @param {ScopeId} scope The scope id of the projection.
     */
    abstract associate<T> (typeOrInstance: Constructor<T> | T, projection: ProjectionId, scope: ScopeId): void;
    /**
     * Associate a projection.
     * @template T
     * @param {Constructor<T> | T} typeOrInstance The type or instance of the type of the projection.
     * @param {ProjectionId} projection The projections id.
     * @param {ScopeId} scope The scope id of the projection.
     */
    abstract associate<T> (typeOrInstance: Constructor<T> | T, projection?: ProjectionId, scope?: ScopeId): void;

    /**
     * Get the projection associated with a type.
     * @template T
     * @param {Constructor<T>} type The type of the projection.
     */
    abstract getFor<T> (type: Constructor<T>): ProjectionAssociation;
    /**
     * Get the type the projection is associated with.
     * @param {ProjectionId} projection The id of the projection.
     * @param {ScopeId} scope The scope of the projection.
     */
    abstract getType (projection: ProjectionId, scope: ScopeId): Constructor<any>;
}
