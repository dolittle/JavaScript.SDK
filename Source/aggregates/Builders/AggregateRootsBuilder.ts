// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { Cancellation } from '@dolittle/sdk.resilience';

import { AggregateRoots } from '../Internal/AggregateRoots';
import { getDecoratedAggregateRootType } from '../aggregateRootDecorator';
import { AggregateRootTypes } from '../AggregateRootTypes';
import { IAggregateRootsBuilder } from './IAggregateRootsBuilder';

/**
 * Represents a builder for registering instances of {@link AggregateRootType} from implementations of {@link AggregateRoot}.
 */
export class AggregateRootsBuilder extends IAggregateRootsBuilder {
    private readonly _aggregateRootTypes = new AggregateRootTypes();

    /** @inheritdoc */
    register<T = any>(type: Constructor<T>): IAggregateRootsBuilder {
        this._aggregateRootTypes.associate(type, getDecoratedAggregateRootType(type));
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
