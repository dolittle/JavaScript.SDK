// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import { ScopeId } from '@dolittle/sdk.events';

import { ProjectionId } from '..';

import { ProjectionDecoratedType } from './ProjectionDecoratedType';
import { ProjectionDecoratedTypes } from './ProjectionDecoratedTypes';
import { ProjectionOptions } from './ProjectionOptions';

/**
 * Decorator to mark a class as an Projection.
 * @param {ProjectionId | Guid | string} projectionId - The id to associate with this Projection.
 * @param {ProjectionOptions} [options={}] - Options to give to the Projection.
 */
export function projection(projectionId: ProjectionId | Guid | string, options: ProjectionOptions = {}) {
    return function (target: any) {
        ProjectionDecoratedTypes.register(new ProjectionDecoratedType(
            ProjectionId.from(projectionId),
            options.inScope ? ScopeId.from(options.inScope) : ScopeId.default,
            target));
    };
}
