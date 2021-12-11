// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { EventTypeId } from '@dolittle/sdk.events';

import { OnMethodSignature } from './OnMethodSignature';
import { OnDecoratedMethod } from './OnDecoratedMethod';

/**
 * Defines the system that knows about all the methods decorated with the on decorator.
 */
export class OnDecoratedMethods {
    /**
     * All on methods grouped by their aggregate root.
     */
    static readonly methodsPerAggregate: Map<Function, OnDecoratedMethod[]> = new Map();

    /**
     * Registers on decorated methods.
     * @param {Constructor<any>} target - Target that owns the on method.
     * @param {Constructor<any> | EventTypeId | Guid | string} eventTypeOrId - Type or event type id of event the handle on is for or the event.
     * @param {number | undefined} generation - Generation of event type or undefined.
     * @param {OnMethodSignature<any>} method - The on method.
     * @param {string} name - The name of the method.
     */
    static register(
        target: Constructor<any>,
        eventTypeOrId: Constructor<any> | EventTypeId | Guid | string,
        generation: number | undefined,
        method: OnMethodSignature<any>,
        name: string): void {
        let methods = this.methodsPerAggregate.get(target);
        if (!methods) {
            this.methodsPerAggregate.set(target, methods = []);
        }
        methods.push(new OnDecoratedMethod(target, eventTypeOrId, generation, method, name));
    }
}
