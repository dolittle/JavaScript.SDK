// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { ScopeId } from '@dolittle/sdk.events';

import { Key } from '../Key';
import { ProjectionId } from '../ProjectionId';

/**
 * The exception that gets thrown when multiple projection states with the same key is received from the Runtime when getting all states.
 */
export class ReceivedDuplicateProjectionKeys extends Exception {
    /**
     * Initialises a new instance of the {@link ReceivedDuplicateProjectionKeys} class.
     * @param {ProjectionId} projection - The projection identifier.
     * @param {ScopeId} scope - The scope of the projection.
     * @param {Key} key - The key that was duplicated.
     */
    constructor(projection: ProjectionId, scope: ScopeId, key: Key) {
        super(`Received multiple states from the Runtime with the key ${key} for projection ${projection} in scope ${scope} when getting all.`);
    }
}
