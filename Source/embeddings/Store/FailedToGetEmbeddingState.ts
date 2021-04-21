// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { Key } from '@dolittle/sdk.projections';
import { EmbeddingId } from '..';


export class FailedToGetEmbeddingState extends Exception {
    constructor(embedding: EmbeddingId, key: Key) {
        super(`Failed to get embedding ${embedding} with key ${key}. No state returned for embedding.`);
    }
}
