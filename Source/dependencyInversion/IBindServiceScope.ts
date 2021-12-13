// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/**
 * Defines a system that can specify the scope of a service binding.
 */
export abstract class IBindServiceScope {
    /**
     * Sets the service binding to be transient.
     * This is the default behaviour and means that a new instance will be created for each service resolution.
     */
    abstract asTransient(): void;

    /**
     * Sets the service binding to be singleton.
     * This means that a single instance of the service will be created and shared for all resolutions.
     */
    abstract asSingleton(): void;
}
