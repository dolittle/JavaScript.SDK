// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { createIsModelIdentifier, ModelIdentifier } from '@dolittle/sdk.common';
import { AggregateRootId, isAggregateRootId } from '@dolittle/sdk.events';

import { AggregateRootType, isAggregateRootType } from './AggregateRootType';

/**
 * Represents the identifier of an aggregate root in an application model.
 */
export class AggregateRootModelId extends ModelIdentifier<AggregateRootId, '@dolittle/sdk.events.AggregateRootModelId', { aggregateRootType: AggregateRootType }> {
    /**
     * Initialises a new instance of the {@link AggregateRootModelId} class.
     * @param {AggregateRootType} aggregateRootType - The aggregate root type.
     */
    constructor(aggregateRootType: AggregateRootType) {
        super(aggregateRootType.id, '@dolittle/sdk.events.AggregateRootModelId', { aggregateRootType });
    }

    /**
     * Gets the aggregate root type of the identifier.
     */
    get aggregateRootType(): AggregateRootType {
        return this.__extras.aggregateRootType;
    }

    /** @inheritdoc */
    protected [Symbol.toStringTag] = 'AggregateRoot';

    /** @inheritdoc */
    protected toStringExtras(extras: { aggregateRootType: AggregateRootType }): object {
        return { generation: this.aggregateRootType.generation };
    }
}

/**
 * Checks whether or not an object is an instance of {@link AggregateRootModelId}.
 * @param {any} object - The object to check.
 * @returns {boolean} True if the object is an {@link AggregateRootModelId}, false if not.
 */
export const isAggregateRootModelId = createIsModelIdentifier(
    AggregateRootModelId,
    isAggregateRootId,
    '@dolittle/sdk.events.AggregateRootModelId',
    { aggregateRootType: isAggregateRootType });
