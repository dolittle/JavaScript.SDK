// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { OccurredFormat } from './OccurredFormat';

/**
 * Represents an event occurred key selector.
 */
export class EventOccurredKeySelector {
    readonly occurredFormat: OccurredFormat;

    /**
     * Initializes a new instance of {@link OccurredFormat}.
     * @param {OccurredFormat | string} occurredFormat - The occurred format to use as format for getting key from event occurred metadata.
     */
    constructor(occurredFormat: OccurredFormat | string) {
        this.occurredFormat = OccurredFormat.from(occurredFormat);
    }
}
