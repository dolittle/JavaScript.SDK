// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';

/**
 * Exception that is thrown when there are expected events to come back from the runtime and there are none.
 */
export class MissingEventsFromRuntime extends Exception {
    /**
     * Initializes a new instance of {@link MissingEventsFromRuntime}.
     */
    constructor() {
        super('Events are not present in payload coming back from runtime');
    }
}
