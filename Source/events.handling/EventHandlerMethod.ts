// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EventContext } from '@dolittle/sdk.events';

export type EventHandlerSignature<T> = (event: T, context: EventContext) => void;

export class EventHandlerMethod {
    constructor(private _method: EventHandlerSignature<any>) {
    }

    invoke(self: any, event: any, context: EventContext) {
        this._method.apply(self, [event, context]);
    }
}

