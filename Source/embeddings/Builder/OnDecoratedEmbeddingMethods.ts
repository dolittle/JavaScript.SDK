// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { EventTypeId, Generation } from '@dolittle/sdk.events';
import { KeySelector } from '@dolittle/sdk.projections';
import { Constructor } from '@dolittle/types';
import { EmbeddingClassOnMethod } from './EmbeddingClassOnMethod';
import { OnDecoratedEmbeddingMethod } from './OnDecoratedEmbeddingMethod';

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
     * @param {Generation | number | undefined} generation Generation of event type or undefined.
     * @param {EmbeddingClassOnMethod} method The method that handles the event.
     * @param {string} name The name of the method.
     */
    static register(
        target: Constructor<any>,
        eventTypeOrId: Constructor<any> | EventTypeId | Guid | string,
        generation: Generation | number | undefined,
        method: EmbeddingClassOnMethod,
        name: string): void {
        let methods = this.methodsPerEmbedding.get(target);
        if (!methods) {
            this.methodsPerEmbedding.set(target, methods = []);
        }
        methods.push(new OnDecoratedEmbeddingMethod(target, eventTypeOrId, generation, method, name));
    }
}
