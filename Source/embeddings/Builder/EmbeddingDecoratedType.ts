// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { EmbeddingId } from '..';

/**
 * Represents a embedding created from the decorator
 */
export class EmbeddingDecoratedType {
    constructor(
        readonly embeddingId: EmbeddingId,
        readonly type: Constructor<any>) {
    }
}
