// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { EmbeddingRequest } from '@dolittle/runtime.contracts/Embeddings/Embeddings_pb';

export class UnknownEmbeddingRequestCase extends Exception {
    constructor(requestCase: EmbeddingRequest.RequestCase) {
        super(`Embedding request has an unknown/unset request case: ${requestCase}`)
    }
}
