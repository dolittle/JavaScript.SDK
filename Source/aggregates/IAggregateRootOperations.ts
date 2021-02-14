// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { AggregateRootAction } from './AggregateRootAction';
import { AggregateRoot } from './AggregateRoot';

/**
 * Defines a system for working with operations that can be formed on an {@link AggregateRoot}.
 * @template TAggregate {@link AggregateRoot} type
 */

export interface IAggregateRootOperations<TAggregate extends AggregateRoot> {

    /**
     * Perform an operation on an {@link AggregateRoot}
     * @param {AggregateRootAction<TAggregate> action Callback for working with the aggregate root.
     * @returns {Promise<void>}
     */
    perform(action: AggregateRootAction<TAggregate>): Promise<void>;
}
