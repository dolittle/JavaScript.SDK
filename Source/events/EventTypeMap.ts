// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ArtifactTypeMap } from '@dolittle/sdk.artifacts';

import { EventType } from './EventType';
import { EventTypeId } from './EventTypeId';

/**
 * Represents a map for mapping an event type to a given type.
 * @template T Type to map to.
 */
export class EventTypeMap<T> extends ArtifactTypeMap<EventType, EventTypeId, T> {
    /** @inheritdoc */
    get [Symbol.toStringTag]() {
        return 'EvenTypeMap';
    }
}
