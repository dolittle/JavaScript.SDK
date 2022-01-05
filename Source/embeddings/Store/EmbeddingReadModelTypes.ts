// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import { EmbeddingId } from '../EmbeddingId';
import { IEmbeddingReadModelTypes } from './IEmbeddingReadModelTypes';

/**
 * Represents an implementation of {@link IEmbeddingReadModelTypes}.
 */
export class EmbeddingReadModelTypes extends IEmbeddingReadModelTypes {
    protected identifierTypeName = 'Embedding';

    /** @inheritdoc */
    protected createIdentifier(id: string | EmbeddingId | Guid): EmbeddingId {
        return EmbeddingId.from(id);
    }
}
