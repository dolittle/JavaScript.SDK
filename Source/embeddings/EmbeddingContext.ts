// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ExecutionContext } from '@dolittle/sdk.execution';
import { Key } from '@dolittle/sdk.projections';

/**
 * Represents the context of a embedding.
 */
export class EmbeddingContext {

    /**
     * Initializes a new instance of {@link EmbeddingContext}.
     * @param {boolean} wasCreatedFromInitialState - Whether the projection state was created from the initial state or retrieved from a persisted state.
     * @param {Key} key - The key for the embeddings projection.
     * @param {boolean} isDelete - Whether this is a call for a deletion.
     * @param {ExecutionContext} executionContext - The execution context for this embedding.
     */
    constructor(
        readonly wasCreatedFromInitialState: boolean,
        readonly key: Key,
        readonly isDelete: boolean,
        readonly executionContext: ExecutionContext) {}
}
