// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IServiceProvider } from './IServiceProvider';

/**
 * Defines an asynchronous service factory that will be used to resolve an instance of a service.
 * @template T - The service type.
 */
export type AsyncServiceFactory<T> = (services: IServiceProvider) => Promise<T>;
