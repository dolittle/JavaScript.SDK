// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { EventHandlerSignature } from './EventHandlerSignature';

/**
 * Represents methods decorated with the handles decorator.
 */
export class HandlesDecoratedMethod {

    /**
     * Initializes a new instance of {@link HandlesDecoratedMethod}.
     * @param {Constructor<any>} owner Owner of the method.
     * @param {Constructor<any>} eventType Type of event it handles.
     * @param {EventHandlerSignature<any>} method The actual method that handles the event.
     */
    constructor(readonly owner: Constructor<any>, readonly eventType: Constructor<any>, readonly method: EventHandlerSignature<any>) {
    }
}
