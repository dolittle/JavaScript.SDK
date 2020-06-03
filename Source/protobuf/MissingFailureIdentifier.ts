// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/**
 * Exception that gets thrown when a protobuf failure is missing the identifier.
 */
export class MissingFailureIdentifier extends Error {

    /**
     * Initializes a new instance ofe {MissingFailureIdentifier}.
     */
    constructor() {
        super('Missing failure identifier during conversion from Protobuf');
    }
}
