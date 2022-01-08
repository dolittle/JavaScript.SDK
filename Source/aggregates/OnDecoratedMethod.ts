// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { Generation } from '@dolittle/sdk.artifacts';
import { EventTypeIdLike } from '@dolittle/sdk.events';

import { OnMethodSignature } from './OnMethodSignature';

/**
 * Represents methods decorated with the on decorator.
 */
export class OnDecoratedMethod {

    /**
     * Initializes a new instance of {@link OnDecoratedMethod}.
     * @param {Constructor<any>} owner - Owner of the method.
     * @param {Constructor<any> | EventTypeIdLike} eventTypeOrId - Type or event type id of event it handles.
     * @param {Generation | undefined} generation - Generation of the event or undefined.
     * @param {OnMethodSignature<any>} method - The actual method that handles the event.
     * @param {string} name - The name of the method.
     */
    constructor(
        readonly owner: Constructor<any>,
        readonly eventTypeOrId: Constructor<any> | EventTypeIdLike,
        readonly generation: Generation | undefined,
        readonly method: OnMethodSignature<any>,
        readonly name: string) {
    }
}
