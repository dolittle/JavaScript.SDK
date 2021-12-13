// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { TenantId } from '@dolittle/sdk.execution';

import { IServiceBinder } from './IServiceBinder';

/**
 * Defines a callback that will be called to provide tenant specific service bindings.
 */
export type TenantServiceBindingCallback = (binder: IServiceBinder, tenant: TenantId) => void;
