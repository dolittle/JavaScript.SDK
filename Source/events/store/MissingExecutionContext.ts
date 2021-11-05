// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';

/**
 * Exception that is thrown when the execution context is missing.
 */
export class MissingExecutionContext extends Exception {

    /**
     * Initializes a new instance of {@link MissingExecutionContext}.
     */
    constructor() {
        super('The execution context is missing. Impossible to continue.');
    }
}
