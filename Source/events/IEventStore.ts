// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ArtifactId, Artifact } from '@dolittle/sdk.artifacts';
import { CommittedEvent } from './CommittedEvent';
import { CommittedEvents } from './CommittedEvents';
import { EventSourceId } from './EventSourceId';

export interface IEventStore {
    commit(event: any, eventSourceId: EventSourceId, artifact?: Artifact | ArtifactId): Promise<CommittedEvent>;
    commit(events: any[], eventSourceId: EventSourceId, artifacts?: Artifact[] | ArtifactId[]): Promise<CommittedEvents>;
    commitPublic(event: any, eventSourceId: EventSourceId, artifact?: Artifact | ArtifactId): Promise<CommittedEvent>;
    commitPublic(events: any[], eventSourceId: EventSourceId, artifacts?: Artifact[] | ArtifactId[]): Promise<CommittedEvents>;
}
