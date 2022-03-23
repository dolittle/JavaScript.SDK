// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EventSourceId } from '@dolittle/sdk.events';

import { AggregateRoot } from '../../AggregateRoot';
import { on } from '../../onDecorator';

import { EventWithOnMethod, EventWithoutOnMethod } from './events';

export class AnAggregateRoot extends AggregateRoot {
    readonly onMethodEventsCalled: any[] = [];

    constructor(eventSourceId: EventSourceId) {
        super(eventSourceId);
    }

    applyWithOnMethod(event: EventWithOnMethod) {
        this.apply(event);
    }

    applyWithoutOnMethod(event: EventWithoutOnMethod) {
        this.apply(event);
    }

    applyBoth(first: EventWithOnMethod, second: EventWithoutOnMethod) {
        this.apply(first);
        this.apply(second);
    }

    @on(EventWithOnMethod)
    onEvent(event: EventWithOnMethod) {
        this.onMethodEventsCalled.push(event);
    }
}
