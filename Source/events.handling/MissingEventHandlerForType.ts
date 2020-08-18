// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { Artifact } from '@dolittle/sdk.artifacts';

/**
 * Exception that is thrown when there is no event handler for a specific event type.
 */
export class MissingEventHandlerForType extends Exception {
    constructor(artifact: Artifact) {
        super(`Missing event handler for '${artifact}'`);
    }
}
