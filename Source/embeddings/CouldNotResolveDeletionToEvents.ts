// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';

/**
 * Exception to be thrown by users of the SDK when it is not possible to resolve an embedding delete call to events.
 */
export class CouldNotResolveDeletionToEvents extends Exception {
    /**
     * Initializes a new instance of {@link CouldNotResolveDeletionToEvents}.
     */
    constructor() {
        super('resolveDeletionToEvents has failed to process');
    }
}
