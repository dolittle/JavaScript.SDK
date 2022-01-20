// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { ensureDecoratorMetadataMap, hasDecoratorMetadataMap } from './decoratorMetadataMap';

/**
 * Checks whether or not the metadata of the specified type has the named data.
 * @param {string} name - The metadata name to check for.
 * @param {Constructor<any>} type - The type to check metadata on.
 * @param {boolean} [createMetadata] - An optional boolean to specify whether or not to create the metadata map if it doesn't exist.
 * @returns {boolean} True if it is set, false if not.
 */
export function hasDecoratorMetadata(name: string, type: Constructor<any>, createMetadata?: boolean): boolean {
    if (createMetadata === false && !hasDecoratorMetadataMap(type)) {
        return false;
    }

    const metadata = ensureDecoratorMetadataMap(type);
    return metadata.has(name);
}
