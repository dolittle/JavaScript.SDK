// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ExecutionContext } from '@dolittle/sdk.execution';
import { Constructor } from '@dolittle/types';

/**
 * Defines an IoC Container for dependency inversion.
 */
export abstract class IContainer {

    /**
     * Get the instance of a service.
     * @param {Constructor} service - Type of service by its constructor to get.
     * @param {ExecutionContext} executionContext - The current execution context to use for resolving tenant-dependant services.
     * @returns The instance.
     */
    abstract get(service: Constructor, executionContext: ExecutionContext): any;
}
