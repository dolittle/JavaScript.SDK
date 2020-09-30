// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EventTypeId } from './EventTypeId';
import { Generation } from './Generation';

/**
 * Represents the type of an event.
 *
 * @export
 * @class EventType
 */
export class EventType {
    constructor(readonly id: EventTypeId, readonly generation: Generation = Generation.first) {
    }

    /** @inheritdoc */
    toString() {
        return `EventType(${this.id}, ${this.generation})`;
    }
}
