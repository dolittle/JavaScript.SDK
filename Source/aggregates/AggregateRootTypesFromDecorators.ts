// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';
import { Generation } from '@dolittle/sdk.artifacts';
import { AggregateRootId } from '@dolittle/sdk.events';
import { AggregateRootTypes } from './AggregateRootTypes';
import { AggregateRootTypeAlias } from './AggregateRootTypeAlias';
import { AggregateRootType } from './AggregateRootType';

/**
 * Represents aggregate root types coming from decorators.
 */
export class AggregateRootTypesFromDecorators {
    static readonly aggregateRootTypes = new AggregateRootTypes();

    /**
     * Associate a type with a unique artifact identifier and optional generation.
     * @param {Constructor} type - Type to associate.
     * @param {AggregateRootId} identifier - Identifier to associate with.
     * @param {Generation} generation - Optional generation - defaults to 0.
     * @param {AggregateRootTypeAlias} alias - The alias of the aggregate root type.
     */
    static associate(type: Constructor<any>, identifier: AggregateRootId, generation: Generation, alias: AggregateRootTypeAlias): void {
        this.aggregateRootTypes.associate(type, new AggregateRootType(identifier, generation, alias));
    }
}
