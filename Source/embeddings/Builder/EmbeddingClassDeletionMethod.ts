// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EmbeddingContext } from '../EmbeddingContext';

/**
 * Defines the embedding class deletion method signature.
 */
export type EmbeddingClassDeletionMethod = (context: EmbeddingContext) => any | any[];
