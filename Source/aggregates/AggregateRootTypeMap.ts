// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ArtifactTypeMap } from '@dolittle/sdk.artifacts';
import { AggregateRootId } from '@dolittle/sdk.events';

import { AggregateRootType } from './AggregateRootType';

/**
 * Represents a map for mapping an aggregate root type to a given type.
 * @template T Type to map to.
 */
export class AggregateRootTypeMap<T> extends ArtifactTypeMap<AggregateRootType, AggregateRootId, T> {
    /** @inheritdoc */
    get [Symbol.toStringTag]() {
        return 'AggregateRootTypeMap';
    }
}
