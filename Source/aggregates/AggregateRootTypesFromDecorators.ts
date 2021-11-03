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
     * @param {Constructor} type Type to associate.
     * @param {ArtifactId} identifier Identifier to associate with.
     * @param {number} generation Optional generation - defaults to 0.
     */
    static associate(type: Constructor<any>, identifier: AggregateRootId, generation: Generation = Generation.first, alias: AggregateRootTypeAlias | undefined): void {
        this.aggregateRootTypes.associate(type, new AggregateRootType(identifier, generation, alias));
    }
}
