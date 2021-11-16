// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { ScopeId } from '@dolittle/sdk.events';
import { ProjectionId } from '../ProjectionId';

/**
 * Exception that gets thrown when trying to get a type that is not associated to a projection.
 */
export class NoTypeAssociatedWithProjection extends Exception {
    /**
     * Initialises a new instance of the {@link NoTypeAssociatedWithProjection} class.
     * @param {ProjectionId} projection - The id of the projection that is not associated with a type.
     * @param {ScopeId} scope - The scope of the projection that is not associated with a type.
     */
    constructor(projection: ProjectionId, scope: ScopeId) {
        super(`No type associated with projection ${projection} in scope ${scope}`);
    }
}
