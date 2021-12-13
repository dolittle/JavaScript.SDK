// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';

import { ScopeId } from '@dolittle/sdk.events';
import { Failure } from '@dolittle/sdk.protobuf';

import { Key } from '../Key';
import { ProjectionId } from '../ProjectionId';

/**
 * Exception that gets thrown when getting a projection fails.
 */
export class FailedToGetProjection extends Exception {
    /**
     * Initialises a new instance of the {@link FailedToGetProjection} class.
     * @param {ProjectionId} projection - The id of the projection to get.
     * @param {ScopeId} scope - The scope of the projection to get.
     * @param {Key | undefined} key - The optional key of the projection to get.
     * @param {Failure} failure - The failure that occured.
     */
    constructor(projection: ProjectionId, scope: ScopeId, key: Key | undefined, failure: Failure) {
        if (key) {
            super(`Failed to get projection ${projection} in scope ${scope} with key ${key} due to failure ${failure.id} with reason: ${failure.reason}`);
        } else {
            super(`Failed to get projection ${projection} in scope ${scope} due to failure ${failure.id} with reason: ${failure.reason}`);
        }
    }
}
