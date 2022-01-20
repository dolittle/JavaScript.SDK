// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IEmbeddingsBuilder } from './IEmbeddingsBuilder';

/**
 * Defines the callback signature used for building embeddings.
 */
export type EmbeddingsBuilderCallback = (builder: IEmbeddingsBuilder) => void;
