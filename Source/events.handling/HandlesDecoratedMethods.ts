// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/rudiments';

import { HandlesDecoratedMethod } from './HandlesDecoratedMethod';
import { EventHandlerSignature } from './EventHandlerSignature';

/**
 * Defines the system that knows about all the methods decorated with the handle decorator.
 */
export class HandlesDecoratedMethods {
    /**
     * All handle methods grouped by their event handler.
     */
    static readonly methodsPerEventHandler: Map<Function, HandlesDecoratedMethod[]> = new Map();

    /**
     * Registers handles decorated methods
     * @param {Constructor<any>} target Target that owns the handle method.
     * @param {Constructor<any>} eventType Type of event the handle method is for.
     * @param {EventHandlerSignature<any>} method The handle method.
     */
    static register(target: Constructor<any>, eventType: Constructor<any>, method: EventHandlerSignature<any>): void {
        let methods = this.methodsPerEventHandler.get(target);
        if (!methods) {
            this.methodsPerEventHandler.set(target, methods = []);
        }
        methods.push(new HandlesDecoratedMethod(target, eventType, method));
    }
}
