// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Artifacts } from '@dolittle/sdk.artifacts';
import { EventType } from './EventType';
import { EventTypeId } from './EventTypeId';

/**
 * Defines the system for working with {@link EventType}.
 */
export abstract class IEventTypes extends Artifacts<EventType, EventTypeId> {
}
