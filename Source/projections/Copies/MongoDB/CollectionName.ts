// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs, createIsConceptAsString } from '@dolittle/concepts';

import { InvalidCollectionName } from './InvalidCollectionName';

/**
 * Defines the types that can be converted into a {@link CollectionName}.
 */
export type CollectionNameLike = string | CollectionName;

/**
 * Represents the name of a Collection in MongoDB.
 */
export class CollectionName extends ConceptAs<string, '@dolittle/sdk.projections.Copies.MongoDB.CollectionName'> {
    /**
     * Initialises a new instance of the {@link CollectionName} class.
     * @param {string} name - The name of the collection.
     */
    constructor(name: string) {
        super(name, '@dolittle/sdk.projections.Copies.MongoDB.CollectionName');
    }

    /**
     * Checks if the collection name is considered a valid MongoDB collection name.
     * @returns {[true] | [false, Error]} A value indicating whether or not the collection name is valid, and potentially an error describing why not.
     */
    isValid(): [true] | [false, Error] {
        if (this.value === undefined || this.value === null || this.value.trim().length < 1) {
            return [false, new InvalidCollectionName(this, 'must not be null or empty')];
        }

        if (new TextEncoder().encode(this.value).length >= 120) {
            return [false, new InvalidCollectionName(this, 'must be at most 120 bytes long')];
        }

        if (this.value.includes('$')) {
            return [false, new InvalidCollectionName(this, 'cannot contain the character "$"')];
        }

        if (this.value.includes('\0')) {
            return [false, new InvalidCollectionName(this, 'cannot contain the null character')];
        }

        if (this.value.startsWith('system.')) {
            return [false, new InvalidCollectionName(this, 'cannot start with "system."')];
        }

        return [true];
    }

    /**
     * Gets the not set collection name.
     */
    static get notSet(): CollectionName {
        return CollectionName.from('Not Set');
    }

    /**
     * Creates a {@link CollectionName} from a {@link string}.
     * @param {CollectionNameLike} name - The name of the collection.
     * @returns {CollectionName} The created collection name concept.
     */
    static from(name: CollectionNameLike): CollectionName {
        if (isCollectionName(name)) return name;
        return new CollectionName(name);
    }
}

/**
 * Checks whether or not an object is an instance of {@link CollectionName}.
 * @param {any} object - The object to check.
 * @returns {boolean} True if the object is an {@link CollectionName}, false if not.
 */
export const isCollectionName = createIsConceptAsString(CollectionName, '@dolittle/sdk.projections.Copies.MongoDB.CollectionName');
