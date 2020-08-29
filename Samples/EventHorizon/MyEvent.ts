// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
import {eventType } from '@dolittle/sdk.events';

@eventType('c7b37f26-ffe4-4ffc-9a53-8d67acbecd4d')
export class MyEvent {
    anInteger!: number;
    aString!: string;
}
