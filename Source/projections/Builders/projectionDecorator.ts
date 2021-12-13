// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { Decorators } from '@dolittle/sdk.common';
import { ScopeId } from '@dolittle/sdk.events';

import { ProjectionId } from '../ProjectionId';
import { ProjectionDecoratedType } from './ProjectionDecoratedType';
import { ProjectionOptions } from './ProjectionOptions';

const [decorator, getMetadata] = Decorators.createMetadataDecorator<ProjectionDecoratedType>('projection', 'projection', Decorators.DecoratorTarget.Class);

/**
 * Decorator to mark a class as an Projection.
 * @param {ProjectionId | Guid | string} projectionId - The id to associate with this Projection.
 * @param {ProjectionOptions} [options={}] - Options to give to the Projection.
 * @returns {Decorators.Decorator} The decorator.
 */
export function projection(projectionId: ProjectionId | Guid | string, options: ProjectionOptions = {}): Decorators.Decorator {
    return decorator((target, type) => {
        return new ProjectionDecoratedType(
            ProjectionId.from(projectionId),
            options.inScope ? ScopeId.from(options.inScope) : ScopeId.default,
            type);
    });
}

/**
 * Gets the {@link ProjectionDecoratedType} of the specified class.
 * @param {Constructor<any>} type - The class to get the decorated projection type for.
 * @returns {ProjectionDecoratedType | undefined} The decorated projection type if decorated.
 */
export function getProjectionDecoratedType(type: Constructor<any>): ProjectionDecoratedType | undefined {
    return getMetadata(type);
}
