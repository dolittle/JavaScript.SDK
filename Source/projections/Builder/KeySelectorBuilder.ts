// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EventPropertyKeySelector, EventSourceIdKeySelector, PartitionIdKeySelector } from '..';

/**
 * Represents a builder for building {@link KeySelector}.
 */
export class KeySelectorBuilder<T = any> {
    /**
     * Select projection key from the event source id.
     * @returns {EventSourceIdKeySelector}
     */
    keyFromEventSource(): EventSourceIdKeySelector {
        return new EventSourceIdKeySelector();
    }

    /**
     * Select projection key from the event stream partition id.
     * @returns {PartitionIdKeySelector}
     */
    keyFromPartitionId(): PartitionIdKeySelector {
        return new PartitionIdKeySelector();
    }

    /**
     * Select projection key from a property on the event.
     * @param {keyof T} property The property to use as key.
     * @returns {EventPropertyKeySelector}
     */
    keyFromProperty(property: keyof T): EventPropertyKeySelector {
        return new EventPropertyKeySelector(property as string);
    }
}
