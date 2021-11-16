// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Generation } from '@dolittle/sdk.artifacts';
import { EventTypeId } from '@dolittle/sdk.events';
import { Constructor } from '@dolittle/types';
import { DeleteReadModelInstance } from '../index';
import { KeySelectorBuilder } from './KeySelectorBuilder';
import { KeySelectorBuilderCallback } from './KeySelectorBuilderCallback';
import { OnDecoratedProjectionMethods } from './OnDecoratedProjectionMethods';

type Returns = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void | DeleteReadModelInstance;

/**
 * Decorator for decorating on methods in a projection class.
 */
export function on<T>(type: Constructor<T>, keySelectorCallback: KeySelectorBuilderCallback<T>): Returns;
export function on(eventType: EventTypeId | Guid | string, keySelectorCallback: KeySelectorBuilderCallback): Returns;
export function on(eventType: EventTypeId | Guid | string, generation: Generation | number, keySelectorCallback: KeySelectorBuilderCallback): Returns;
/**
 * @param typeOrId
 * @param keySelectorCallbackOrGeneration
 * @param maybeKeySelectorCallback
 */
export function on<T>(typeOrId: Constructor<T> | EventTypeId | Guid | string, keySelectorCallbackOrGeneration: KeySelectorBuilderCallback<T> | Generation | number, maybeKeySelectorCallback?: KeySelectorBuilderCallback<T>) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const generation = typeof keySelectorCallbackOrGeneration === 'number' ? keySelectorCallbackOrGeneration : undefined;
        const keySelectorCallback = typeof keySelectorCallbackOrGeneration === 'function' ? keySelectorCallbackOrGeneration : maybeKeySelectorCallback!;
        const keySelector = keySelectorCallback(new KeySelectorBuilder());
        OnDecoratedProjectionMethods.register(target.constructor, typeOrId, generation, keySelector, descriptor.value, propertyKey);
    };
}
