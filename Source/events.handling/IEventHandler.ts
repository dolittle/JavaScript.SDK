// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Artifact } from '@dolittle/sdk.artifacts';
import { EventContext } from '@dolittle/sdk.events';

/**
 * Defines an event handler
 */
export interface IEventHandler {
    readonly handledEvents: Iterable<Artifact>;
    handle(event: any, artifact: Artifact, context: EventContext): void;
}
