// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { EventTypeId, Generation } from '@dolittle/sdk.events';
import { Constructor } from '@dolittle/types';
import { EmbeddingClassOnMethod } from './EmbeddingClassOnMethod';

/**
 * Represents embedding methods decorated with the on decorator.
 */
export class OnDecoratedEmbeddingMethod {

    /**
     * Initializes a new instance of {@link OnDecoratedEmbeddingMethod}.
     * @param {Constructor<any>} owner Owner of the method.
     * @param {Constructor<any> | EventTypeId | Guid | string} eventTypeOrId Type or event type id of event it handles.
     * @param {Generation | number | undefined} generation Generation of the event or undefined.
     * @param {EmbeddingClassOnMethod} method The actual method that handles the event.
     * @param {string} name The name of the method.
     */
    constructor(
        readonly owner: Constructor<any>,
        readonly eventTypeOrId: Constructor<any> | EventTypeId | Guid | string,
        readonly generation: Generation | number | undefined,
        readonly method: EmbeddingClassOnMethod,
        readonly name: string) {
    }
}
