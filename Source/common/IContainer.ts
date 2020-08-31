// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/rudiments';

/**
 * Defines an IoC Container for dependency inversion.
 */
export interface IContainer {

    /**
     * Get the instance of a service.
     * @param {Function} service Type of service by its constructor to get
     * @returns The instance.
     */
    get(service: Constructor): any;
}

