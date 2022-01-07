// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { TypeMap } from '@dolittle/sdk.artifacts';

import { EmbeddingId } from '../EmbeddingId';
import { IEmbeddingReadModelTypes } from './IEmbeddingReadModelTypes';

/**
 * Represents an implementation of {@link IEmbeddingReadModelTypes}.
 */
export class EmbeddingReadModelTypes extends TypeMap<EmbeddingId, [string]> implements IEmbeddingReadModelTypes {
    /**
     * Initialises a new instance of the {@link EmbeddingReadModelTypes} class.
     */
    constructor() {
        super(EmbeddingId, embeddingId => [embeddingId.value.toString()], 1);
    }
}
