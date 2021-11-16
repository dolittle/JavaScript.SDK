// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ProjectionDecoratedType } from './ProjectionDecoratedType';

/**
 * Handles registering and mappings between @projection decorated classes and their given id and options.
 */
export class ProjectionDecoratedTypes {
    static readonly types: ProjectionDecoratedType[] = [];

    /**
     * Registers a decorated projection class with the Runtime.
     * @param {ProjectionDecoratedType} projectionDecoratedType - The decorated type to register.
     */
    static register(projectionDecoratedType: ProjectionDecoratedType) {
        this.types.push(projectionDecoratedType);
    }
}
