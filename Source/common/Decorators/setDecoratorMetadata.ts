// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';
import { ensureDecoratorMetadataMap } from './ensureDecoratorMetadataMap';

/**
 * Sets the named data in the metadata of the specified type.
 * @param {string} name - The metadata name to set.
 * @param {Constructor<any>} type - The type to set metadata on.
 * @param {T} value - The value to set for the named data.
 * @template T The type of the metadata value.
 */
export function setDecoratorMetadata<T>(name: string, type: Constructor<any>, value: T): void {
    const metadata = ensureDecoratorMetadataMap(type);
    metadata.set(name, value);
}
