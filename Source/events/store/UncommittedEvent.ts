// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EventSourceId, EventType, EventTypeId } from '../index';

/**
 * Represents and uncommitted event
 */
export abstract class UncommittedEvent {
    /**
     * The source of the event - a unique identifier that is associated with the event.
     */
    abstract eventSourceId: EventSourceId;

    /**
     * An event type or an identifier representing the event type.
     * @summary If no event type identifier or event type is supplied, it will look for associated event types based
     * on the actual type of the event.
     */
    abstract eventType?: EventType | EventTypeId;

    /**
     * The content of the event.
     */
    abstract content: any;

    /**
     * Indicates whether the event is public or not.
     */
    abstract public?: boolean;
}
