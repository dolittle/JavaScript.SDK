// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { KeySelector, KeySelectorType } from '..';

/**
 * Represents a builder for building {@link KeySelector}.
 */
export class KeySelectorBuilder<T = any> {
    /**
     * Select projection key from the event source id.
     * @returns {KeySelector}
     */
    keyFromEventSource(): KeySelector {
        return new KeySelector(KeySelectorType.EventSourceId);
    }

    /**
     * Select projection key from the event stream partition id.
     * @returns {KeySelector}
     */
    keyFromPartitionId(): KeySelector {
        return new KeySelector(KeySelectorType.PartitionId);
    }

    /**
     * Select projection key from a property on the event.
     * @param {keyof T} property The property to use as key.
     * @returns {KeySelector}
     */
    keyFromProperty(property: keyof T): KeySelector {
        return new KeySelector(KeySelectorType.Property, property as string);
    }
}
