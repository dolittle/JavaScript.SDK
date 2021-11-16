// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';

/**
 * Exception that gets thrown when a protobuf failure is missing the identifier.
 */
export class MissingFailureIdentifier extends Exception {

    /**
     * Initializes a new instance of the {@link MissingFailureIdentifier} class.
     */
    constructor() {
        super('Missing failure identifier during conversion from Protobuf');
    }
}
