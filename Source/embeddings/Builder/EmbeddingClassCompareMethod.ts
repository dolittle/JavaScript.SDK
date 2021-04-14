// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EmbeddingContext } from '../EmbeddingContext';

export type EmbeddingClassCompareMethod<T = any> = (receivedState: T, context: EmbeddingContext) => any | any[];
