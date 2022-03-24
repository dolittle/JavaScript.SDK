// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EventType, EventTypeId, EventTypes, IEventTypes } from '@dolittle/sdk.events';

export class EventWithOnMethod {
    constructor(readonly property: number) {}
}

export class EventWithoutOnMethod {
    constructor(readonly property: string) {}
}

export const event_types = (): IEventTypes => {
    const types = new EventTypes();
    types.associate(EventWithOnMethod, new EventType(EventTypeId.from('a8881f3f-a34e-4289-9ba9-41f6a79c8d72')));
    types.associate(EventWithoutOnMethod, new EventType(EventTypeId.from('334b6259-05e6-420d-856e-5f45e3e740f3')));
    return types;
};
