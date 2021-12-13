// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { DependencyContainer } from 'tsyringe';

/**
 * Defines the interface of a TSyringe container.
 */
export type TSyringeContainer = DependencyContainer;

/**
 * Checks whether or not the provided container is an TSyringe container.
 * @param {any} container - The container to check.
 * @returns {boolean} True if the container is an {@link TSyringeContainer}, false if not.
 */
export const isTSyringeContainer = (container: any): container is TSyringeContainer => {
    if (typeof container.isRegistered !== 'function' || container.isRegistered.length !== 1) return false;
    if (typeof container.resolve !== 'function' || container.resolve.length !== 1) return false;
    if (typeof container.resolveAll !== 'function' || container.resolveAll.length !== 1) return false;

    return true;
};
