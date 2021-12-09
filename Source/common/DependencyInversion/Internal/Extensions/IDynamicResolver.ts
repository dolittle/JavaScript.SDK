// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { interfaces } from 'inversify';

import { Bindings } from './Bindings';

/**
 * Defines a dynamic service resolver that will be called when unknown services are being resolved.
 */
export abstract class IDynamicResolver {
    /**
     * The method that is called to resolve services that is not bound in the container.
     * @param {interfaces.ServiceIdentifier} serviceIdentifier - The service identifier that was not bound to a service.
     * @param {Bindings} bindings - The container to potentially resolved services to.
     */
    abstract bindUnknownService(serviceIdentifier: interfaces.ServiceIdentifier, bindings: Bindings): void;
}
