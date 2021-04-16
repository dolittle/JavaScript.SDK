// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EmbeddingContext } from './EmbeddingContext';

/**
 * Defines the signature of a embedding class' compare() method
 */
export type EmbeddingDeleteCallback<T = any> = (currentState: T, context: EmbeddingContext) => any | any[];
