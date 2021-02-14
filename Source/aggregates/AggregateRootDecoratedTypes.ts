// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';
import { MissingAggregateRootDecoratorFor } from './MissingAggregateRootDecoratorFor';
import { AggregateRootDecoratedType } from './AggregateRootDecoratedType';

/**
 * Handles the registrations of @aggregateRoot decorated classes.
 */
export class AggregateRootDecoratedTypes {
    static readonly types: AggregateRootDecoratedType[] = [];

    /**
     * Get the aggregate root details for a specific type.
     * @param {Constructor<any>} type Type to get for.
     * @returns {AggregateRootDecoratedType}
     */
    static getFor(type: Constructor<any>): AggregateRootDecoratedType {
        const decoratedType = this.types.find(_ => _.type === type);
        if (!decoratedType) {
            throw new MissingAggregateRootDecoratorFor(type);
        }
        return decoratedType;
    }

    /**
     * Registers aggregate root decorated type
     * @param {AggregateRootDecoratedType} aggregateRootDecoratedType Type to register
     */
    static register(aggregateRootDecoratedType: AggregateRootDecoratedType) {
        this.types.push(aggregateRootDecoratedType);
    }
}
