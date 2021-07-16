// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EmbeddingContext } from '../EmbeddingContext';

/**
 * Defines the embedding class update method signature.
 */
export type EmbeddingClassUpdateMethod<TReadModel = any> = (receivedState: TReadModel, context: EmbeddingContext) => any | any[];
