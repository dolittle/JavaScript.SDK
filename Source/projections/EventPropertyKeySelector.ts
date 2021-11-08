// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { PropertyNameKeySelector } from './PropertyNameKeySelector';

/**
 * Represents an event property key selector.
 */
export class EventPropertyKeySelector {
    readonly propertyName: PropertyNameKeySelector;

    /**
     * Initializes a new instance of {@link PropertyNameKeySelector}
     * @param {PropertyNameKeySelector | string} propertyName The property on the event to use as key
     */
    constructor(propertyName: PropertyNameKeySelector | string) {
        this.propertyName = PropertyNameKeySelector.from(propertyName);
    }
}
