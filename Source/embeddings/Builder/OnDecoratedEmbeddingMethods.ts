// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { EmbeddingClassOnMethod, OnDecoratedEmbeddingMethod } from '@dolittle/sdk.embeddings';
import { EventTypeId } from '@dolittle/sdk.events';
import { KeySelector } from '@dolittle/sdk.projections';
import { Constructor } from '@dolittle/types';

/**
 * Represents the system that knows about all the methods decorated with the on decorator.
 */
export class OnDecoratedEmbeddingMethods {
    /**
     * All on methods grouped by their embedding.
     */
    static readonly methodsPerEmbedding: Map<Function, OnDecoratedEmbeddingMethod[]> = new Map();

    /**
     * Registers on decorated embedding methods
     * @param {Constructor<any>} target Target that owns the on method.
     * @param {Constructor<any> | EventTypeId | Guid | string} eventTypeOrId Type or event type id of event the on method is for or the event.
     * @param {number | undefined} generation Generation of event type or undefined.
     * @param {KeySelector} keySelector The key selector to use for this event type.
     * @param {ProjectionClassOnMethod} method The method that handles the event.
     * @param {string} name The name of the method.
     */
    static register(
        target: Constructor<any>,
        eventTypeOrId: Constructor<any> | EventTypeId | Guid | string,
        generation: number | undefined,
        keySelector: KeySelector,
        method: EmbeddingClassOnMethod,
        name: string): void {
        let methods = this.methodsPerEmbedding.get(target);
        if (!methods) {
            this.methodsPerEmbedding.set(target, methods = []);
        }
        methods.push(new OnDecoratedEmbeddingMethod(target, eventTypeOrId, generation, keySelector, method, name));
    }
}
