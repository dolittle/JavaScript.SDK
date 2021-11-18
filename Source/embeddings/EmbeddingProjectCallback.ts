// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { DeleteReadModelInstance } from '@dolittle/sdk.projections';
import { EmbeddingProjectContext } from './EmbeddingProjectContext';

/**
 * Represents the callback for an embeddings on() method.
 */
export type EmbeddingProjectCallback<TReadModel, TEvent = any> = (readModel: TReadModel, event: TEvent, context: EmbeddingProjectContext) => TReadModel | DeleteReadModelInstance | Promise<TReadModel | DeleteReadModelInstance>;
