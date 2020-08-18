// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';

/**
 * Exception that gets thrown when a protobuf artifact is missing the artifact identifier.
 */
export class MissingArtifactIdentifier extends Exception {

    /**
     * Initializes a new instance ofe {MissingArtifactIdentifier}.
     */
    constructor() {
        super('Missing artifact identifier during conversion from Protobuf');
    }
}
