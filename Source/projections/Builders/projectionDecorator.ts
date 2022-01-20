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
 * Checks whether the specified class is decorated with an projection type.
 * @param {Constructor<any>} type - The class to check the decorated projection type for.
 * @returns {boolean} True if the decorator is applied, false if not.
 */
export function isDecoratedProjectionType(type: Constructor<any>): boolean {
    return getMetadata(type, false, false) !== undefined;
}

/**
 * Gets the {@link ProjectionDecoratedType} of the specified class.
 * @param {Constructor<any>} type - The class to get the decorated projection type for.
 * @returns {ProjectionDecoratedType} The decorated projection type.
 */
export function getDecoratedProjectionType(type: Constructor<any>): ProjectionDecoratedType {
    return getMetadata(type, true, 'Classes used as projections must be decorated');
}
