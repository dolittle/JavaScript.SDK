// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ContainerInstance } from 'typedi';

type TypeDIContainerBase = {
    [K in keyof ContainerInstance]: ContainerInstance[K];
};

/**
 * Defines the interface of an TypeDI container.
 */
export interface TypeDIContainer extends TypeDIContainerBase {}

/**
 * Checks whether or not the provided container is an TypeDI container.
 * @param {any} container - The container to check.
 * @returns {boolean} True if the container is an {@link TypeDIContainer}, false if not.
 */
export const isTypeDIContainer = (container: any): container is TypeDIContainer => {
    if (typeof container.has !== 'function' || container.has.length !== 1) return false;
    if (typeof container.get !== 'function' || container.get.length !== 1) return false;
    if (typeof container.getMany !== 'function' || container.getMany.length !== 1) return false;

    return true;
};
