// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EmbeddingContext } from './EmbeddingContext';

/**
 * Defines the signature of a embedding class' compare() method
 */
export type EmbeddingCompareCallback<TReadModel = any> = (receivedState: TReadModel, currentState: TReadModel, context: EmbeddingContext) => any | any[];
