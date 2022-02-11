// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EventOccurredKeySelector } from '../EventOccurredKeySelector';
import { EventPropertyKeySelector } from '../EventPropertyKeySelector';
import { EventSourceIdKeySelector } from '../EventSourceIdKeySelector';
import { Key } from '../Key';
import { OccurredFormat } from '../OccurredFormat';
import { PartitionIdKeySelector } from '../PartitionIdKeySelector';
import { StaticKeySelector } from '../StaticKeySelector';

/**
 * Represents a builder for building {@link KeySelector}.
 * @template T The type of the projection read model.
 */
export class KeySelectorBuilder<T = any> {
    /**
     * Select projection key from the event source id.
     * @returns {EventSourceIdKeySelector} A key selector.
     */
    keyFromEventSource(): EventSourceIdKeySelector {
        return new EventSourceIdKeySelector();
    }

    /**
     * Select projection key from the event stream partition id.
     * @returns {PartitionIdKeySelector} A key selector.
     */
    keyFromPartitionId(): PartitionIdKeySelector {
        return new PartitionIdKeySelector();
    }

    /**
     * Select projection key from a property on the event.
     * @param {keyof T} property - The property to use as key.
     * @returns {EventPropertyKeySelector} A key selector.
     */
    keyFromProperty(property: keyof T): EventPropertyKeySelector {
        return new EventPropertyKeySelector(property as string);
    }

    /**
     * Sets a static key as projection key.
     * @param {string | Key} key - The property to use as key.
     * @returns {StaticKeySelector} A key selector.
     */
    staticKey(key: string | Key): StaticKeySelector {
        return new StaticKeySelector(key);
    }

    /**
     * Select projection key from the given format of when an event occurred.
     * @param {string | OccurredFormat} occurredFormat - The occurred format.
     * @returns {StaticKeySelector} A key selector.
     */
    keyFromEventOccurred(occurredFormat: string | OccurredFormat): EventOccurredKeySelector {
        return new EventOccurredKeySelector(occurredFormat);
    }

}
