// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { AggregateRootId } from '..';

/**
 * Exception that gets thrown when a an event is applied to an event source other than the one expected.
 */
export class EventWasAppliedByOtherAggregateRoot extends Error {

    /**
     * Initializes a new instance of {@link EventWasAppliedToOtherEventSource}.
     * @param {AggregateRootId} aggregateRoot - The applied event source.
     * @param {AggregateRootId} expectedAggregateRoot - The expected event source.
     */
    constructor(aggregateRoot: AggregateRootId, expectedAggregateRoot: AggregateRootId) {
        super(`Aggregate Root '${aggregateRoot}' does not match with expected '${expectedAggregateRoot}'.`);
    }
}
