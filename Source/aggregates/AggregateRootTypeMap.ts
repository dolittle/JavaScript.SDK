// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ArtifactTypeMap, Generation } from '@dolittle/sdk.artifacts';
import { AggregateRootId } from '@dolittle/sdk.events';
import { AggregateRootType } from './AggregateRootType';

/**
 * Represents a map for mapping an aggregate root type to a given type and provide.
 * @template T Type to map to.
 */
export class AggregateRootTypeMap<T> extends ArtifactTypeMap<AggregateRootType, AggregateRootId, T> {
    /**
     * Initializes a new instance of {@link EventTypeMap}.
     */
    constructor() {
        super();
    }
    /** @inheritdoc */
    [Symbol.toStringTag] = 'AggregateRootTypeMap';

    /** @inheritdoc */
    protected createArtifact(id: string, generation: Generation): AggregateRootType {
        return new AggregateRootType(AggregateRootId.from(id), generation);
    }

}
