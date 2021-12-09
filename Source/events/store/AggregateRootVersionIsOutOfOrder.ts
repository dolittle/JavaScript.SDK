// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { AggregateRootVersion } from '..';

/**
 * Exception that gets thrown when a sequence of events are not valid for the Aggregate Root it is being used with.
 */
export class AggregateRootVersionIsOutOfOrder extends Error {

    /**
     * Initializes a new instance of {@link AggregateRootVersionIsOutOfOrder}.
     * @param {AggregateRootVersion} version - The attempted version number.
     * @param {AggregateRootVersion} expectedVersion - The expected version number.
     */
    constructor(version: AggregateRootVersion, expectedVersion: AggregateRootVersion) {
        super(`Aggregate Root Version is out of order. Version '${version}' does not match '${expectedVersion}'.`);
    }
}
