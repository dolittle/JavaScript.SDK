// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { Cancellation } from '@dolittle/sdk.resilience';

import { AggregateRoots } from '../Internal/AggregateRoots';
import { AggregateRootTypes } from '../AggregateRootTypes';
import { AggregateRootTypesFromDecorators } from '../AggregateRootTypesFromDecorators';

/**
 * Represents a builder for registering instances of {@link AggregateRootType} from implementations of {@link AggregateRoot}.
 */
export class AggregateRootsBuilder {
    private readonly _aggregateRootTypes = new AggregateRootTypes();

    /**
     * Register the type as an {@link AggregateRootType}.
     * @param {Constructor<T>} type - The type to register as an {@link AggregateRootType}.
     * @returns {AggregateRootsBuilder} The builder for continuation.
     * @template T The type of the aggregate root.
     */
    register<T = any>(type: Constructor<T>): AggregateRootsBuilder {
        this._aggregateRootTypes.associate(type, AggregateRootTypesFromDecorators.aggregateRootTypes.getFor(type));
        return this;
    }

    /**
     * Builds the aggregate roots by registering them with the Runtime.
     * @param {AggregateRoots} aggregateRoots - The aggregate roots client.
     * @param {Cancellation} cancellation - The cancellation.
     */
    buildAndRegister(aggregateRoots: AggregateRoots, cancellation: Cancellation) {
        aggregateRoots.register(this._aggregateRootTypes, cancellation);
    }
}
