// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Failure } from '@dolittle/sdk.protobuf';
import { CommittedAggregateEvents } from './CommittedAggregateEvents';

/**
 * Represents the result from a commit of events.
 */
export class CommitAggregateEventsResult {

    /**
     * Initializes a new instance of {@link CommitEventsResult}.
     * @param {CommittedAggregateEvents} events - Events committed.
     * @param {Failure} failure - Failure from the response.
     */
    constructor(readonly events: CommittedAggregateEvents, readonly failure?: Failure) {
    }

    /**
     * Gets whether or not the commit has failed.
     */
    get failed() {
        return !!this.failure;
    }
}
