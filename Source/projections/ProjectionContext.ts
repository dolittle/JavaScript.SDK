// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EventContext } from '@dolittle/sdk.events';

import { Key } from './Key';

/**
 * Represents the context of a projection.
 */
export class ProjectionContext {

    /**
     * Initializes a new instance of {@link ProjectionContext}.
     * @param {boolean} wasCreatedFromInitialState - Whether the projection state was created from the initial state or retrieved from a persisted state.
     * @param {Key} key - The projection key.
     * @param {EventContext} eventContext - The context of the event.
     */
    constructor(
        readonly wasCreatedFromInitialState: boolean,
        readonly key: Key,
        readonly eventContext: EventContext) {
    }
}
