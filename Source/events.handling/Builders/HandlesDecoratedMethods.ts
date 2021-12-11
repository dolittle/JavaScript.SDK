// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { EventTypeId } from '@dolittle/sdk.events';

import { EventHandlerSignature } from '../EventHandlerSignature';
import { HandlesDecoratedMethod } from './HandlesDecoratedMethod';

/**
 * Defines the system that knows about all the methods decorated with the handle decorator.
 */
export class HandlesDecoratedMethods {
    /**
     * All handle methods grouped by their event handler.
     */
    static readonly methodsPerEventHandler: Map<Function, HandlesDecoratedMethod[]> = new Map();

    /**
     * Registers handles decorated methods.
     * @param {Constructor<any>} target - Target that owns the handle method.
     * @param {Constructor<any> | EventTypeId | Guid | string} eventTypeOrId - Type or event type id of event the handle method is for or the event.
     * @param {number | undefined} generation - Generation of event type or undefined.
     * @param {EventHandlerSignature<any>} method - The handle method.
     * @param {string} name - The name of the method.
     */
    static register(
        target: Constructor<any>,
        eventTypeOrId: Constructor<any> | EventTypeId | Guid | string,
        generation: number | undefined,
        method: EventHandlerSignature<any>,
        name: string): void {
        let methods = this.methodsPerEventHandler.get(target);
        if (!methods) {
            this.methodsPerEventHandler.set(target, methods = []);
        }
        methods.push(new HandlesDecoratedMethod(target, eventTypeOrId, generation, method, name));
    }
}
