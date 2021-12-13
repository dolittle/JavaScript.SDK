// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { InversifyServiceProvider } from './Internal/Implementations/InversifyServiceProvider';
import { TSyringeServiceProvider } from './Internal/Implementations/TSyringeServiceProvider';
import { isInversifyContainer } from './Types/InversifyContainer';
import { isTSyringeContainer } from './Types/TSyringeContainer';
import { IServiceProvider } from './IServiceProvider';
import { KnownServiceProviders } from './KnownServiceProviders';
import { UnknownServiceProviderType } from './UnknownServiceProviderType';

/**
 * Creates a root {@link IServiceProvider} from the specified service provider.
 * @param {KnownServiceProviders} serviceProvider - The service provider to use as root container.
 * @returns {IServiceProvider} The root service provider.
 * @throws {UnknownServiceProviderType} If the type of the service provider is not recognised.
 */
export function createRootServiceProvider(serviceProvider: KnownServiceProviders): IServiceProvider {
    if (isInversifyContainer(serviceProvider)) {
        return new InversifyServiceProvider(serviceProvider);
    }

    if (isTSyringeContainer(serviceProvider)) {
        return new TSyringeServiceProvider(serviceProvider);
    }

    const type = Object.getPrototypeOf(serviceProvider).constructor as Constructor<any>;
    throw new UnknownServiceProviderType(type);
}
