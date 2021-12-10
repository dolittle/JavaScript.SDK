// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { interfaces } from 'inversify';

import { IServiceProvider } from '../..';
import { Bindings } from './Bindings';
import { IDynamicResolver } from './IDynamicResolver';

/**
 * Represents an implementation of {@link IDynamicResolver} that tries to resolve unknown services from an underlying {@link IServiceProvider}.
 */
export class DelegatingResolver extends IDynamicResolver {
    /**
     * Initialises a new instance of the {@link DelegatingResolver} class.
     * @param {IServiceProvider} _services - The underlying service provider to use to resolve the services.
     */
    constructor(private readonly _services: IServiceProvider) {
        super();
    }

    /** @inheritdoc */
    bindUnknownService(serviceIdentifier: interfaces.ServiceIdentifier<unknown>, bindings: Bindings): void {
        console.log('Delegating called with', serviceIdentifier);
        if (this._services.has(serviceIdentifier)) {
            // TODO: Deal with ResolveAll here (probably easy with the context)
            bindings.bind(serviceIdentifier).toDynamicValue(() => this._services.get(serviceIdentifier));
        }
    }
}
