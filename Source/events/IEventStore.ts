// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ArtifactId, Artifact } from '@dolittle/sdk.artifacts';
import { Cancellation } from '@dolittle/sdk.resilience';

import { CommitEventsResponse, EventSourceId, UncommittedEvent } from './index';import { Guid } from '@dolittle/rudiments';
;

/**
 * Defines the API surface for the event store
 */
export interface IEventStore {

    /**
     * Commit a single event.
     * @param {*} event The content of the event.
     * @param eventSourceId The source of the event - a unique identifier that is associated with the event.
     * @param {Artifact|Guid|string} [artifact] An artifact or an identifier representing the artifact.
     * @param {Cancellation} cancellation The cancellation signal.
     * @returns Promise<CommitEventsResponse>
     * @summary If no artifact identifier or artifact is supplied, it will look for associated artifacts based
     * on the actual type of the event.
     */
    commit(event: any, eventSourceId: Guid | string, artifact?: Artifact | Guid | string, cancellation?: Cancellation): Promise<CommitEventsResponse>;

    /**
     * Commit a collection of events.
     * @param {UncommittedEvent[]} events Collection of events.
     * @param {Cancellation} cancellation The cancellation signal.
     * @returns Promise<CommitEventsResponse>
     * @summary If no artifact identifier or artifact is supplied, it will look for associated artifacts based
     * @summary on the actual type of the event.
     */
    commit(events: UncommittedEvent[], cancellation?: Cancellation): Promise<CommitEventsResponse>;

    /**
     * Commit a single public event.
     * @param {*} event The content of the event.
     * @param eventSourceId The source of the event - a unique identifier that is associated with the event.
     * @param {Artifact|Guid|string} [artifact] An artifact or an identifier representing the artifact.
     * @param {Cancellation} cancellation The cancellation signal.
     * @returns Promise<CommitEventsResponse>
     * @summary If no artifact identifier or artifact is supplied, it will look for associated artifacts based
     * on the actual type of the event.
     */
    commitPublic(event: any, eventSourceId: Guid | string, artifact?: Artifact | Guid | string, cancellation?: Cancellation): Promise<CommitEventsResponse>;
}
