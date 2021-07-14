// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EmbeddingContext } from '../EmbeddingContext';

/**
 * Defines the embedding class compare method signature.
 */
// TODO rename
export type EmbeddingClassCompareMethod<TReadModel = any> = (receivedState: TReadModel, context: EmbeddingContext) => any | any[];
