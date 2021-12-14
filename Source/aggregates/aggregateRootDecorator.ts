// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { Generation } from '@dolittle/sdk.artifacts';
import { Decorators } from '@dolittle/sdk.common';
import { AggregateRootId, AggregateRootIdLike } from '@dolittle/sdk.events';

import { AggregateRootType } from './AggregateRootType';
import { AggregateRootTypeAlias } from './AggregateRootTypeAlias';
import { AggregateRootTypeOptions } from './AggregateRootTypeOptions';

const [decorator, getMetadata] = Decorators.createMetadataDecorator<AggregateRootType>('aggregate-root-type', 'aggregateRoot', Decorators.DecoratorTarget.Class);

/**
 * Decorator to mark a class as an aggregate root.
 * @param {AggregateRootIdLike} aggregateRootId - The identifier of the aggregate root.
 * @param {AggregateRootTypeOptions} [options={}] - Options to give to the aggregate root.
 * @returns {Decorators.Decorator} The decorator.
 */
export function aggregateRoot(aggregateRootId: AggregateRootIdLike, options: AggregateRootTypeOptions = {}): Decorators.Decorator {
    return decorator((target, type) => {
        return new AggregateRootType(
            AggregateRootId.from(aggregateRootId),
            Generation.first,
            AggregateRootTypeAlias.from(options.alias ?? type.name));
    });
}

/**
 * Checks whether the specified class is decorated with an aggregate root type.
 * @param {Constructor<any>} type - The class to check the decorated aggregate root type for.
 * @returns {boolean} True if the decorator is applied, false if not.
 */
export function isDecoratedAggregateRootType(type: Constructor<any>): boolean {
    return getMetadata(type, false, false) !== undefined;
}

/**
 * Gets the decorated aggregate root type of the specified class.
 * @param {Constructor<any>} type - The class to get the decorated aggregate root type for.
 * @returns {AggregateRootType} The decorated aggregate root type.
 */
export function getDecoratedAggregateRootType(type: Constructor<any>): AggregateRootType {
    return getMetadata(type, true, 'Classes used as aggregate roots must be decorated');
}
