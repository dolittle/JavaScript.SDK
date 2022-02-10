// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Key } from './Key';

/**
 * Represents an event occurred key selector.
 */
export class StaticKeySelector {
    readonly staticKey: Key;

    /**
     * Initializes a new instance of {@link Key}.
     * @param {Key | string} key - The static key to use as projection key.
     */
    constructor(key: Key | string) {
        this.staticKey = Key.from(key);
    }
}
