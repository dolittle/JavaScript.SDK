// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { ScopeId } from '@dolittle/sdk.events';

import { Key } from '../Key';
import { ProjectionId } from '../ProjectionId';

/**
 * The exception that gets thrown when the Runtime responds with a projection state with a wrong key when getting a single projection state from the store.
 */
export class WrongKeyReceivedFromRuntime extends Exception {
    /**
     * Initialises a new instance of the {@link WrongKeyReceivedFromRuntime} class.
     * @param {ProjectionId} projection - The projection identifier.
     * @param {ScopeId} scope - The scope identifier for the projection.
     * @param {Key} expectedKey - The key that was requested.
     * @param {string} receivedKey - The key that was received.
     */
    constructor(projection: ProjectionId, scope: ScopeId, expectedKey: Key, receivedKey: string) {
        super(`A projection state with the wrong key was returned by the Runtime for Projection ${projection} in Scope ${scope}. Expected '${expectedKey.value}', received '${receivedKey}'`);
    }
}
