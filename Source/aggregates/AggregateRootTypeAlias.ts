// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs, createIsConceptAsString } from '@dolittle/concepts';

/**
 * Defines types that can be converted to a {@link AggregateRootTypeAlias}.
 */
export type AggregateRootTypeAliasLike = string | AggregateRootTypeAlias;

/**
 * Represents the alias of an aggregate root type.
 */
export class AggregateRootTypeAlias extends ConceptAs<string, '@dolittle/sdk.aggregates.AggregateRootTypeAlias'> {
    /**
     * Initialises a new instance of the {@link AggregateRootTypeAlias} class.
     * @param {string} alias - The aggregate root alias.
     */
    constructor(alias: string) {
        super(alias, '@dolittle/sdk.aggregates.AggregateRootTypeAlias');
    }
    /**
     * Creates an {@link AggregateRootTypeAlias} from an {@link AggregateRootTypeAliasLike}.
     * @param {AggregateRootTypeAliasLike} alias - The aggregate root type alias.
     * @returns {AggregateRootTypeAlias} The created aggregate root type alias concept.
     */
    static from(alias: AggregateRootTypeAliasLike): AggregateRootTypeAlias {
        if (alias instanceof AggregateRootTypeAlias) return alias;
        return new AggregateRootTypeAlias(alias);
    }
};

/**
 * Checks whether or not an object is an instance of {@link AggregateRootTypeAlias}.
 * @param {any} object - The object to check.
 * @returns {boolean} True if the object is an {@link AggregateRootTypeAlias}, false if not.
 */
export const isAggregateRootTypeAlias = createIsConceptAsString(AggregateRootTypeAlias, '@dolittle/sdk.aggregates.AggregateRootTypeAlias');
