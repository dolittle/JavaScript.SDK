// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';

import { CollectionName } from './CollectionName';

/**
 * The exception that gets thrown when trying to copy projection read models to an invalid MongoDB collection name.
 */
export class InvalidCollectionName extends Exception {
    /**
     * Initialises a new instance of the {@link InvalidCollectionName} class.
     * @param {CollectionName} name - The collection name that is invalid.
     * @param {string} reason - The reason why the collection name is invalid.
     */
    constructor(name: CollectionName, reason: string) {
        super(`The collection name '${name}', is invalid. Collection names ${reason}`);
    }
}
