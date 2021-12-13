// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { interfaces } from 'inversify';

type CreateChildWithContainerOptions = (containerOptions?: interfaces.ContainerOptions) => interfaces.Container;

/**
 * Calls the callback on the provided container, and recursively on child containers every time a new child is created.
 * @param {interfaces.Container} container - The container to apply the callback to.
 * @param {(container: interfaces.Container) => void} callback - The callback to apply.
 */
export const applyToContainerAndCreatedChildren = (container: interfaces.Container, callback: (container: interfaces.Container) => void) => {
    callback(container);

    const originalCreateChild = container.createChild as CreateChildWithContainerOptions;
    container.createChild = function (containerOptions?: interfaces.ContainerOptions): interfaces.Container {
        const childContainer = originalCreateChild.call(this, containerOptions);
        applyToContainerAndCreatedChildren(childContainer, callback);
        return childContainer;
    };
};
