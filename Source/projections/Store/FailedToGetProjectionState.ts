// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';

import { ScopeId } from '@dolittle/sdk.events';

import { Key } from '../Key';
import { ProjectionId } from '../ProjectionId';

/**
 * The exception that gets thrown when no state is returned for a projection.
 */
export class FailedToGetProjectionState extends Exception {
    /**
     * Creates a new instance of the {@link FailedToGetProjectionState} class.
     * @param {ProjectionId} projection - The identifier of the projection that was retrieved.
     * @param {ScopeId} scope - The scope of the projection that was retrieved.
     * @param {Key} key - The key of the projection that was retrieved.
     */
    constructor(projection: ProjectionId, scope: ScopeId, key: Key) {
        super(`Failed to get projection ${projection} in scope ${scope} with key ${key}. No state returned for projection.`);
    }
}
