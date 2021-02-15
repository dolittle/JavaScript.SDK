// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/**
 * The exception that gets thrown when an aggregate root identifier is not set and is expected
 */
export class AggregateRootIdentifierNotSet extends Error {
    constructor() {
        super('Aggregate root identifier is not set.');
    }
}
