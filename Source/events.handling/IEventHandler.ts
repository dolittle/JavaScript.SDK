// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Artifact } from '@dolittle/sdk.artifacts';
import { EventContext } from '@dolittle/sdk.events';
import { ScopeId } from './ScopeId';
import { EventHandlerId } from './EventHandlerId';

/**
 * Defines an event handler
 */
export interface IEventHandler {
    /**
     * Gets the unique identifier for event handler - {@link EventHandlerId}
     */
    readonly eventHandlerId: EventHandlerId;

    /**
     * Gets the scope the event handler is in
     */
    readonly scopeId: ScopeId;

    /**
     * Gets whether or not the event handler is partitioned.
     */
    readonly partitioned: boolean;

    /**
     * Gets the event types handled by the event handler.
     */
    readonly handledEvents: Iterable<Artifact>;
    handle(event: any, artifact: Artifact, context: EventContext): void;
}
