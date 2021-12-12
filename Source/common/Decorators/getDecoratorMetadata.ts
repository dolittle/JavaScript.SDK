// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';
import { ensureDecoratorMetadataMap } from './ensureDecoratorMetadataMap';

/**
 * Gets the named data in the metadata of the specified type.
 * @param {string} name - The metadata name to get.
 * @param {Constructor<any>} type - The type to get metadata on.
 * @returns {T | undefined} The value of the named data.
 * @template T The type of the metadata value.
 */
export function getDecoratorMetadata<T>(name: string, type: Constructor<any>): T | undefined {
    const metadata = ensureDecoratorMetadataMap(type);
    return metadata.get(name);
}
