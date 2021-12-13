// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Container, interfaces } from 'inversify';

/**
 * Calls the callback on the provided container, and recursively on child containers every time a new child is created.
 * @param {Container} container - The container to apply the callback to.
 * @param {(Container) => void} callback - The callback to apply.
 */
export const applyToContainerAndCreatedChildren = (container: Container, callback: (container: Container) => void) => {
    callback(container);

    const originalCreateChild = container.createChild;
    container.createChild = function (containerOptions?: interfaces.ContainerOptions): Container {
        const childContainer = originalCreateChild.call(this, containerOptions);
        applyToContainerAndCreatedChildren(childContainer, callback);
        return childContainer;
    };
};
