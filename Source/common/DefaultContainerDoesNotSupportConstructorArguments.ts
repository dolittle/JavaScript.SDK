// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';

/**
 * The exception that is thrown when the default container implementation gets asked for an instance that
 * has a constructor that require arguments.
 */
export class DefaultContainerDoesNotSupportConstructorArguments extends Exception {

    /**
     * Initializes an instance of {@link DefaultContainerDoesNotSupportConstructorArguments}.
     */
    constructor() {
        super('The default container is not capable of creating instances of types that has constructor arguments');
    }
}
