// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ArtifactId, Artifact } from '@dolittle/sdk.artifacts';
import { CommittedEvent } from './CommittedEvent';
import { CommittedEvents } from './CommittedEvents';
import { EventSourceId } from './EventSourceId';

/**
 * Defines the API surface for the event store
 */
export interface IEventStore {

    /**
     * Commit a single event.
     * @param {*} event The content of the event.
     * @param eventSourceId The source of the event - a unique identifier that is associated with the event.
     * @param {string|Artifact|ArtifactId} [artifact] An artifact or an identifier representing the artifact.
     * @returns Promise<CommittedEvent>
     * @summary If no artifact identifier or artifact is supplied, it will look for associated artifacts based
     * @summary on the actual type of the event.
     */
    commit(event: any, eventSourceId: EventSourceId, artifact?: string | Artifact | ArtifactId): Promise<CommittedEvent>;

    /**
     * Commit a collection of events.
     * @param {*[]} event Collection of events.
     * @param eventSourceId The source of the event - a unique identifier that is associated with the event.
     * @param {string|Artifact|ArtifactId} [artifacts] A collection of artifacts or identifiers representing the artifact.
     * @returns Promise<CommittedEvent>
     * @summary [Important!] The artifacts array, if given, has to match the length of the collection of events and represent them in the same order.
     * @summary If no artifact identifier or artifact is supplied, it will look for associated artifacts based
     * @summary on the actual type of the event.
     */
    commit(events: any[], eventSourceId: EventSourceId, artifacts?: string[] | Artifact[] | ArtifactId[]): Promise<CommittedEvents>;

    /**
     * Commit a single public event.
     * @param {*} event The content of the event.
     * @param eventSourceId The source of the event - a unique identifier that is associated with the event.
     * @param {string|Artifact|ArtifactId} [artifact] An artifact or an identifier representing the artifact.
     * @returns Promise<CommittedEvent>
     * @summary If no artifact identifier or artifact is supplied, it will look for associated artifacts based
     * @summary on the actual type of the event.
     */
    commitPublic(event: any, eventSourceId: EventSourceId, artifact?: string[] | Artifact | ArtifactId): Promise<CommittedEvent>;

    /**
     * Commit a collection of public events.
     * @param {*[]} event Collection of events.
     * @param eventSourceId The source of the event - a unique identifier that is associated with the event.
     * @param {string|Artifact|ArtifactId} [artifacts] A collection of artifacts or identifiers representing the artifact.
     * @returns Promise<CommittedEvent>
     * @summary [Important!] The artifacts array, if given, has to match the length of the collection of events and represent them in the same order.
     * @summary If no artifact identifier or artifact is supplied, it will look for associated artifacts based
     * @summary on the actual type of the event.
     */
    commitPublic(events: any[], eventSourceId: EventSourceId, artifacts?: string[] | Artifact[] | ArtifactId[]): Promise<CommittedEvents>;
}
