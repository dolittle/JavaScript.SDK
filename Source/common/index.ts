// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

export * as ClientSetup from './ClientSetup';
export * as DependencyInversion from './DependencyInversion';

export {
    IClientBuildResults,
} from './ClientSetup';

export {
    IServiceBinder,
    IServiceProvider,
    IServiceProviderBuilder,
    ITenantServiceProviders,
    inject,
} from './DependencyInversion';
