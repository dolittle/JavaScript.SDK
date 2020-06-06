// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ReplaySubject } from 'rxjs';
import { EventDecoratedMethod } from './EventDecoratedMethod';

export class EventDecoratedMethods {
    static readonly methods: ReplaySubject<EventDecoratedMethod> = new ReplaySubject<EventDecoratedMethod>();

    static register(target: Function, eventType: Function, method: Function) {
        this.methods.next(new EventDecoratedMethod(target, eventType, method));
    }
}
