// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';
import { EmbeddingId } from '..';

/**
 * Exception that is thrown when you try to register a readmodel for a embedding when its already defined.
 */
export class ReadModelAlreadyDefinedForEmbedding extends Exception {
    constructor(embeddingId: EmbeddingId, newReadModel: Constructor<any> | any, oldReadModel: Constructor<any> | any) {
        super(`Cannot assign ${newReadModel} to embedding ${embeddingId}. It is already associated with ${oldReadModel}`);
    }
}
