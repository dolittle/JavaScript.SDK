// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { DeleteReadModelInstance } from '@dolittle/sdk.projections';
import { EmbeddingProjectContext } from '..';

/**
 * Defines the signature of a embedding class's on() method
 */
export type EmbeddingClassOnMethod<T = any> = (event: T, context: EmbeddingProjectContext) => void | DeleteReadModelInstance | Promise<void | DeleteReadModelInstance>;
