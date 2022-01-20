// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { interfaces } from 'inversify';

/**
 * Defines the interface of an InversifyJS container.
 */
export type InversifyContainer = interfaces.Container;

/**
 * Checks whether or not the provided container is an InversifyJS container.
 * @param {any} container - The container to check.
 * @returns {boolean} True if the container is an {@link InversifyContainer}, false if not.
 */
export const isInversifyContainer = (container: any): container is InversifyContainer => {
    if (typeof container.isBound !== 'function' || container.isBound.length !== 1) return false;
    if (typeof container.get !== 'function' || container.get.length !== 1) return false;
    if (typeof container.getAsync !== 'function' || container.getAsync.length !== 1) return false;
    if (typeof container.getAll !== 'function' || container.getAll.length !== 1) return false;
    if (typeof container.getAllAsync !== 'function' || container.getAllAsync.length !== 1) return false;

    if (typeof container.bind !== 'function' || container.bind.length !== 1) return false;

    if (typeof container.createChild !== 'function' || container.createChild.length !== 1) return false;
    if (typeof container.applyCustomMetadataReader !== 'function' || container.applyCustomMetadataReader.length !== 1) return false;

    return true;
};
