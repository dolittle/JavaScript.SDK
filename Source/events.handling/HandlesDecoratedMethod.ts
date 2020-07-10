// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/rudiments';

import { EventHandlerSignature } from './EventHandlerMethod';

export class HandlesDecoratedMethod {
    constructor(readonly owner: Constructor<any>, readonly eventType: Constructor<any>, readonly method: EventHandlerSignature<any>) {
    }
}
