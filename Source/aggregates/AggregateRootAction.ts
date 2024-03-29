// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { AggregateRoot } from './AggregateRoot';

/**
 * Defines the callback for performing an action on an implementation of {@link AggregateRoot}.
 */
export type AggregateRootAction<TAggregate extends AggregateRoot> = (aggregateRoot: TAggregate) => void | Promise<void>;
