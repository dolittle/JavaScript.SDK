// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/**
 * Defines the ExpressJS Node environment.
 */
export abstract class IEnvironment {
    /**
     * Gets a value indicating whether or not the current environment is 'Development'.
     */
    abstract readonly isDevelopment: boolean;
}
