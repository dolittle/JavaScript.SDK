// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { EventHandlerSignature } from '../index';

/**
 * Represents methods decorated with the handles decorator.
 */
export class HandlesDecoratedMethod {

    /**
     * Initializes a new instance of {@link HandlesDecoratedMethod}.
     * @param {Constructor<any>} owner Owner of the method.
     * @param {Constructor<any> | Guid | string} eventTypeOrId Type or event type id of event it handles.
     * @param {number | undefined} generation Generation of the event or undefined.
     * @param {EventHandlerSignature<any>} method The actual method that handles the event.
     * @param {string} name The name of the method.
     */
    constructor(
        readonly owner: Constructor<any>,
        readonly eventTypeOrId: Constructor<any> | Guid | string,
        readonly generation: number | undefined,
        readonly method: EventHandlerSignature<any>,
        readonly name: string) {
    }
}
