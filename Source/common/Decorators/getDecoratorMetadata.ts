// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { ensureDecoratorMetadataMap, hasDecoratorMetadataMap } from './decoratorMetadataMap';

/**
 * Gets the named data in the metadata of the specified type.
 * @param {string} name - The metadata name to get.
 * @param {Constructor<any>} type - The type to get metadata on.
 * @param {boolean} [createMetadata] - An optional boolean to specify whether or not to create the metadata map if it doesn't exist.
 * @returns {T | undefined} The value of the named data.
 * @template T The Type of the metadata value.
 */
export function getDecoratorMetadata<T>(name: string, type: Constructor<any>, createMetadata?: boolean): T | undefined {
    if (createMetadata === false && !hasDecoratorMetadataMap(type)) {
        return undefined;
    }

    const metadata = ensureDecoratorMetadataMap(type);
    return metadata.get(name);
}
