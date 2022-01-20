// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { AggregateRoot } from '../AggregateRoot';
import { AggregateRootType } from '../AggregateRootType';

/**
 * Defines a builder for registering instances of {@link AggregateRootType} from implementations of {@link AggregateRoot}.
 */
export abstract class IAggregateRootsBuilder {
    /**
     * Register the type as an {@link AggregateRootType}.
     * @param {Constructor<T>} type - The type to register as an {@link AggregateRootType}.
     * @returns {IAggregateRootsBuilder} The builder for continuation.
     * @template T The type of the aggregate root.
     */
    abstract register<T = any>(type: Constructor<T>): IAggregateRootsBuilder;
}
