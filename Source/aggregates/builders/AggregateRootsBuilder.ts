// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';
import { AggregateRootTypesFromDecorators, internal } from '../index';
import { AggregateRootTypes } from '../AggregateRootTypes';
import { Cancellation } from '@dolittle/sdk.resilience';

/**
 *
 */
export type AggregateRootsBuilderCallback = (builder: AggregateRootsBuilder) => void;

/**
 * Represents a builder for adding associations into {@link IAggregateRootTypes} instance.
 */
export class AggregateRootsBuilder {
    private readonly _aggregateRootTypes = new AggregateRootTypes();

    /**
     * Register the type as an {@link AggregateRootType}.
     * @param type - The type to register as an {@link AggregateRootType}.
     */
    register<T = any>(type: Constructor<T>): AggregateRootsBuilder {
        this._aggregateRootTypes.associate(type, AggregateRootTypesFromDecorators.aggregateRootTypes.getFor(type));
        return this;
    }

    /**
     * Builds the aggregate roots by registering them with the Runtime.
     * @param aggregateRoots - The aggregate roots client.
     * @param cancellation - The cancellation.
     */
    buildAndRegister(aggregateRoots: internal.AggregateRoots, cancellation: Cancellation) {
        aggregateRoots.register(this._aggregateRootTypes, cancellation);
    }
}
