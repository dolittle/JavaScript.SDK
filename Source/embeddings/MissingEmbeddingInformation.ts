// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';

/**
 * Exception that gets thrown if there are details missing on an embedding.
 */
export class MissingEmbeddingInformation extends Exception {

    /**
     * Initializes a new instance of {@link MissingEmbeddingInformation}.
     * @param {string} details - Details that are missing.
     */
    constructor(details: string) {
        super(`Missing information on embedding: ${details}`);
    }
}
