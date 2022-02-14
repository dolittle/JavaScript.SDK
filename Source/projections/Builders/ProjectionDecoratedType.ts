// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { ScopeId } from '@dolittle/sdk.events';

import { ProjectionId } from '../ProjectionId';
import { ProjectionAlias } from '../ProjectionAlias';

/**
 * Represents a projection created from the decorator.
 */
export class ProjectionDecoratedType {
    /**
     * Initialises a new instance of the {@link ProjectionDecoratedType} class.
     * @param {ProjectionId} projectionId - The identifier of the projection.
     * @param {ScopeId} scopeId - The scope of the projection.
     * @param {ProjectionAlias} alias - The alias of the projection.
     * @param {Constructor<any>} type - The decorated type.
     */
    constructor(
        readonly projectionId: ProjectionId,
        readonly scopeId: ScopeId,
        readonly alias: ProjectionAlias,
        readonly type: Constructor<any>) {
    }
}
