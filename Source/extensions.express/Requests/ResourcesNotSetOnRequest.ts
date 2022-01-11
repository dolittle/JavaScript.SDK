// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';

/**
 * The exception that gets thrown when attempting to access the Dolittle resources property on an incoming request and the property has not been set by the middleware.
 */
export class ResourcesNotSetOnRequest extends Exception {
    /**
     * Initialises a new instance of the {@link ResourcesNotSetOnRequest} class.
     */
    constructor() {
        super('The Dolittle resources have not been resolved for this request. Did you forget to use the Dolittle middleware?');
    }
}
