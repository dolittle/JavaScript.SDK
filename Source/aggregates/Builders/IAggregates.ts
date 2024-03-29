// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { EventSourceIdLike } from '@dolittle/sdk.events';

import { AggregateRoot } from '../AggregateRoot';
import { IAggregateOf } from '../IAggregateOf';
import { IAggregateRootOperations } from '../IAggregateRootOperations';

/**
 * Defines a system that can get aggregate roots scoped to a tenant.
 */
export abstract class IAggregates {
    /**
     * Gets the {@link IAggregateRootOperations} for the {@link TAggregateRoot} class.
     * @param {Constructor<TAggregateRoot>} type - The type of the aggregate to get.
     * @param {EventSourceIdLike} eventSourceId - The {@link EventSourceId} of the aggregate to get.
     * @returns {IAggregateRootOperations<TAggregateRoot>} The aggregate root operations to perform actions on.
     * @template TAggregateRoot The type of the aggregate root.
     */
    abstract get<TAggregateRoot extends AggregateRoot>(type: Constructor<TAggregateRoot>, eventSourceId: EventSourceIdLike): IAggregateRootOperations<TAggregateRoot>;

    /**
     * Gets the {@link IAggregateOf} for the {@link TAggregateRoot} class..
     * @param {Constructor<TAggregateRoot>} type - The type of the aggregate to get.
     * @returns {IAggregateOf<TAggregateRoot>} The aggregate root to get aggregate root operations from.
     * @template TAggregateRoot The type of the aggregate root.
     */
    abstract of<TAggregateRoot extends AggregateRoot>(type: Constructor<TAggregateRoot>): IAggregateOf<TAggregateRoot>;
}
