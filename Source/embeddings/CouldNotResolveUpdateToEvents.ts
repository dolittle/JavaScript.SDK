// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';

export class CouldNotResolveUpdateToEvents extends Exception {

    /**
     * Initializes a new instance of {@link CouldNotResolveUpdateToEvents}
     */
    constructor() {
        super('resolveUpdateToEvents has failed to process');
    }
}
