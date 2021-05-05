// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EventSourceId } from '@dolittle/sdk.events';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { Key } from '@dolittle/sdk.projections';

/**
 * Represents the context of an embeddings projection method.
 */
export class EmbeddingProjectContext {

    /**
     * Initializes a new instance of {@link EmbeddingProjectContext}.
     * @param {boolean} wasCreatedFromInitialState Whether the projection state was created from the initial state or retrieved from a persisted state.
     * @param {Key} key The key for the embeddings projection.
     * @param {EventSourceId} eventSourceId Unique identifier of the event source it originates from.
     * @param {ExecutionContext} executionContext The execution context for this embedding.
     */
    constructor(
        readonly wasCreatedFromInitialState: boolean,
        readonly key: Key,
        readonly eventSourceId: EventSourceId,
        readonly executionContext: ExecutionContext) {}
}
