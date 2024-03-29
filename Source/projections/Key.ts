// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';

/**
 * Represents a projection key.
 */
export class Key extends ConceptAs<string, '@dolittle/sdk.projections.Key'> {
    /**
     * Initializes a new instance of {@link Key}.
     * @param {string} key - The expression that specifices the key selection.
     */
    constructor(key: string) {
        super(key, '@dolittle/sdk.projections.Key');
    }

    /**
     * Creates a {@link Key} from a string.
     * @param {Key | any} key - The projection key.
     * @returns {Key} The projection key concept.
     */
    static from(key: Key | any): Key {
        if (key instanceof Key) {
            return key;
        }
        return new Key(key.toString());
    }
}
