// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { GenerationLike } from '@dolittle/sdk.artifacts';
import { EventTypeIdLike } from '@dolittle/sdk.events';
import { Constructor } from '@dolittle/types';
import { EmbeddingClassOnMethod } from './EmbeddingClassOnMethod';

/**
 * Represents embedding methods decorated with the on decorator.
 */
export class OnDecoratedEmbeddingMethod {

    /**
     * Initializes a new instance of {@link OnDecoratedEmbeddingMethod}.
     * @param {Constructor<any>} owner Owner of the method.
     * @param {Constructor<any> | EventTypeIdLike} eventTypeOrId Type or event type id of event it handles.
     * @param {GenerationLike | undefined} generation Generation of the event or undefined.
     * @param {EmbeddingClassOnMethod} method The actual method that handles the event.
     * @param {string} name The name of the method.
     */
    constructor(
        readonly owner: Constructor<any>,
        readonly eventTypeOrId: Constructor<any> | EventTypeIdLike,
        readonly generation: GenerationLike | undefined,
        readonly method: EmbeddingClassOnMethod,
        readonly name: string) {
    }
}
