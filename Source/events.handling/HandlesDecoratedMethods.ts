// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/rudiments';

import { HandlesDecoratedMethod } from './HandlesDecoratedMethod';
import { EventHandlerSignature } from './EventHandlerMethod';

export class HandlesDecoratedMethods {
    static readonly methodsPerEventHandler: Map<Function, HandlesDecoratedMethod[]> = new Map();

    static register(target: Constructor<any>, eventType: Constructor<any>, method: EventHandlerSignature<any>) {
        let methods = this.methodsPerEventHandler.get(target);
        if (!methods) {
            this.methodsPerEventHandler.set(target, methods = []);
        }
        methods.push(new HandlesDecoratedMethod(target, eventType, method));
    }
}
