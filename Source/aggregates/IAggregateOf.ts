// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EventSourceId } from '@dolittle/sdk.events';
import { AggregateRoot } from './AggregateRoot';
import { IAggregateRootOperations } from './IAggregateRootOperations';

/**
 * Defines a way to work with an {@link AggregateRoot}
 * @template TAggregate
 */

export abstract class IAggregateOf<TAggregate extends AggregateRoot> {

    /**
     * Create a new {@link AggregateRoot} with a random {@link EventSourceId}
     * @returns {IAggregateRootOperations<TAggregate>}
     */
    abstract create(): IAggregateRootOperations<TAggregate>;

    /**
     * Gets an {@link AggregateRoot} with a given {@link EventSourceId}
     * @param {EventSourceId} eventSourceId {@link EventSourceId} of the {@link AggregateRoot}
     * @returns {IAggregateRootOperations<TAggregate>}
     */
    abstract get(eventSourceId: EventSourceId): IAggregateRootOperations<TAggregate>;
}
