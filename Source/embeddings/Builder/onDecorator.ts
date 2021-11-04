// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { GenerationLike } from '@dolittle/sdk.artifacts';
import { EventTypeIdLike } from '@dolittle/sdk.events';
import { DeleteReadModelInstance } from '@dolittle/sdk.projections';
import { Constructor } from '@dolittle/types';
import { OnDecoratedEmbeddingMethods } from './OnDecoratedEmbeddingMethods';

type Returns = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void | DeleteReadModelInstance;

/**
 * Decorator for decorating on methods in an embedding class
 */
export function on<T>(type: Constructor<T>): Returns;
export function on(eventType: EventTypeIdLike): Returns;
export function on<T>(typeOrId: Constructor<T> | EventTypeIdLike, generation?: GenerationLike) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        OnDecoratedEmbeddingMethods.register(target.constructor, typeOrId, generation, descriptor.value, propertyKey);
    };
}
