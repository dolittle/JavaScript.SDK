// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Container, interfaces } from 'inversify';
import { getBindingDictionary } from 'inversify/lib/planning/planner';

import { IDynamicResolver } from './IDynamicResolver';

const applyMiddlewareToContainerAndChildren = (container: Container, middleware: interfaces.Middleware) => {
    container.applyMiddleware(middleware);

    const originalCreateChild = container.createChild;
    container.createChild = function (containerOptions?: interfaces.ContainerOptions): Container {
        const childContainer = originalCreateChild.call(this, containerOptions);
        applyMiddlewareToContainerAndChildren(childContainer, middleware);
        return childContainer;
    };
};

/**
 * Applies a dynamic resolver to be invoked to add bindings to the container when a service is resolved but not bound already.
 * @param {Container} container - The container to apply the dynamic resolver to.
 * @param {IDynamicResolver} resolver - The dynamic resolver to apply.
 */
export const applyDynamicResolver = (container: Container, resolver: IDynamicResolver) => {
    const bindings = getBindingDictionary(container);
    let isPlanning = false;

    const originalHasKey = bindings.hasKey;
    bindings.hasKey = function (serviceIdentifier: interfaces.ServiceIdentifier): boolean {
        const originalResult = originalHasKey.call(this, serviceIdentifier);

        if (!originalResult && isPlanning) {
            resolver.bindUnknownService(serviceIdentifier, container);
            return originalHasKey.call(this, serviceIdentifier);
        }

        return originalResult;
    };

    const planningTrackerMiddleware = (next: interfaces.Next): interfaces.Next => (args: interfaces.NextArgs) => {
        isPlanning = true;

        const originalContextInterceptor = args.contextInterceptor;
        args.contextInterceptor = (context: interfaces.Context): interfaces.Context => {
            isPlanning = false;
            return originalContextInterceptor(context);
        };

        return next(args);
    };

    applyMiddlewareToContainerAndChildren(container, planningTrackerMiddleware);
};
