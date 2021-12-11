// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { ProjectionId } from '../ProjectionId';

/**
 * Exception that is thrown when you try to register a readmodel for a projection when its already defined.
 */
export class ReadModelAlreadyDefinedForProjection extends Exception {
    /**
     * Initialises a new instance of the {@link ReadModelAlreadyDefinedForProjection} class.
     * @param {ProjectionId} projectionId - The projection identifier.
     * @param {Constructor<any> | any} newReadModel - The readmodel type that was attempted to be registered.
     * @param {Constructor<any> | any} oldReadModel - The readmodel type that was already registered.
     */
    constructor(projectionId: ProjectionId, newReadModel: Constructor<any> | any, oldReadModel: Constructor<any> | any) {
        super(`Cannot assign ${newReadModel} to projection ${projectionId}. It is already associated with ${oldReadModel}`);
    }
}
