// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EmbeddingContext } from './EmbeddingContext';

/**
 * Defines the signature of a embedding class' resolveUpdateToEvents() method
 */
export type EmbeddingUpdateCallback<TReadModel = any> = (receivedState: TReadModel, currentState: TReadModel, context: EmbeddingContext) => Object | Object[];
