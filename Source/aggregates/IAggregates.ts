// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EventSourceId } from '@dolittle/sdk.events';

import { AggregateRoot } from './AggregateRoot';
import { IAggregateOf } from './IAggregateOf';
import { IAggregateRootOperations } from './IAggregateRootOperations';

/**
 * Defines a system that can get aggregate roots scoped to a tenant.
 */
export abstract class IAggregates {
    /**
     * Gets the {@link IAggregateRootOperations} for the {@link TAggregateRoot} class.
     * @param eventSourceId - The {@link EventSourceId} of the aggregate to get.
     */
    abstract get<TAggregateRoot extends AggregateRoot>(eventSourceId: EventSourceId): IAggregateRootOperations<TAggregateRoot>;

    /**
     * Gets the {@link IAggregateOf} for the {@link TAggregateRoot} class.
     */
    abstract of<TAggregateRoot extends AggregateRoot>(): IAggregateOf<TAggregateRoot>;
}
