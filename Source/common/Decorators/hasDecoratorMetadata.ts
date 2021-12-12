// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { ensureDecoratorMetadataMap } from './ensureDecoratorMetadataMap';

/**
 * Checks whether or not the metadata of the specified type has the named data.
 * @param {string} name - The metadata name to check for.
 * @param {Constructor<any>} type - The type to check metadata on.
 * @returns {boolean} True if it is set, false if not.
 */
export function hasDecoratorMetadata(name: string, type: Constructor<any>): boolean {
    const metadata = ensureDecoratorMetadataMap(type);
    return metadata.has(name);
}
