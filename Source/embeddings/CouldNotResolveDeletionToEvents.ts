// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
export class CouldNotResolveDeletionToEvents extends Error {
    /**
     * Initializes a new instance of {@link CouldNotResolveDeletionToEvents}
     */
    constructor() {
        super('resolveDeletionToEvents has failed to process');
    }
}