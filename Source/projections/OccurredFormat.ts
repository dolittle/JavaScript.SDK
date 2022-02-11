// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';

/**
 * Represents the format used to represent the date time mapping of when events occurred to projections.
 */
export class OccurredFormat extends ConceptAs<string, '@dolittle/sdk.projections.OccurredFormat'> {
    /**
     * Initializes a new instance of {@link PropertyNameKeySelector}.
     * @param {string} format - The event occurred format.
     */
    constructor(format: string) {
        super(format, '@dolittle/sdk.projections.OccurredFormat');
    }

    /**
     * Creates a {@link OccurredFormat} from a string.
     * @param {string | OccurredFormat} format - The format to convert.
     * @returns {OccurredFormat} The converted key selector.
     */
    static from(format: string | OccurredFormat): OccurredFormat {
        if (format instanceof OccurredFormat) { return format; }
        return new OccurredFormat(format);
    }
}
