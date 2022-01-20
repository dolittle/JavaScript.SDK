// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

const DECORATOR_METADATA_KEY = '@dolittle/sdk.common/Decorators';

/**
 * Checks whether or not the decorator metadata map exists on the provided type.
 * @param {Constructor<any>} type - The type to check if the map exists on.
 * @returns {boolean} True if the type has the decorator metadata map, false if not.
 */
export function hasDecoratorMetadataMap(type: Constructor<any>): boolean {
    const descriptor = Object.getOwnPropertyDescriptor(type, DECORATOR_METADATA_KEY);
    return descriptor !== undefined && descriptor.value instanceof Map;
}

/**
 * Ensures that the decorator metadata map exists on the provided type.
 * @param {Constructor<any>} type - The type to ensure the map exists on.
 * @returns {Map<string, any>} The metadata map on the type.
 */
export function ensureDecoratorMetadataMap(type: Constructor<any>): Map<string, any> {
    const descriptor = Object.getOwnPropertyDescriptor(type, DECORATOR_METADATA_KEY);

    if (
        descriptor !== undefined &&
        descriptor.configurable === false &&
        descriptor.enumerable === false &&
        descriptor.writable === false &&
        descriptor.get === undefined &&
        descriptor.set === undefined &&
        descriptor.value instanceof Map
    ) {
        return descriptor.value;
    }

    const metadataMap = new Map();

    Object.defineProperty(type, DECORATOR_METADATA_KEY, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: metadataMap,
    });

    return metadataMap;
}
