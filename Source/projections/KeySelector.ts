
// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { KeySelectorType } from './KeySelectorType';
import { KeySelectorExpression } from './KeySelectorExpression';

/**
 * Represents a projection event key selector.
 */
export class KeySelector {

    /**
     * Gets the key selector type.
     */
    readonly type: KeySelectorType;

    /**
     * Gets key selector expression.
     */
    readonly expression: KeySelectorExpression;

    /**
     * Initializes a new instance of {@link KeySelector}
     * @param {KeySelectorType} type The key selector type.
     */
    constructor(type: KeySelectorType.EventSourceId | KeySelectorType.PartitionId);
    /**
     * Initializes a new instance of {@link KeySelector}
     * @param {KeySelectorType} type The key selector type.
     * @param {string} property The property on the event to get the key from.
     */
    constructor(type: KeySelectorType.Property, property: string);
    constructor(type: KeySelectorType, property?: string) {
        this.type = type;
        this.expression = KeySelectorExpression.from(property ?? '');
    }
}
