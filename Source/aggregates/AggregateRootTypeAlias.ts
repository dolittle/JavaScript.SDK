// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';

export type AggregateRootTypeAliasLike = string | AggregateRootTypeAlias;

/**
 * Represents the alias of an aggregate root type.
 *
 * @export
 * @class EventTypeAlias
 * @extends {ConceptAs<string, '@dolittle/sdk.aggregates.AggregateRootTypeAlias'>}
 */
export class AggregateRootTypeAlias extends ConceptAs<string, '@dolittle/sdk.aggregates.AggregateRootTypeAlias'> {
    constructor(alias: string) {
        super(alias, '@dolittle/sdk.aggregates.AggregateRootTypeAlias');
    }
    /**
     * Creates an {@link AggregateRootTypeAlias} from a string.
     *
     * @static
     * @param {(Guid | string)} id
     * @returns {EventSourceId}
     */
    static from(id: AggregateRootTypeAliasLike): AggregateRootTypeAlias {
        if (id instanceof AggregateRootTypeAlias) return id;
        return new AggregateRootTypeAlias(id);
    }
};
