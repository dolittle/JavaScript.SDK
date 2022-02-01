// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs, createIsConceptAsString } from '@dolittle/concepts';

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
