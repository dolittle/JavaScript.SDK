// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';
import { Generation } from '@dolittle/sdk.artifacts';
import { AggregateRootId, AggregateRootIdLike } from '@dolittle/sdk.events';
import { AggregateRootTypeAlias } from './AggregateRootTypeAlias';
import { AggregateRootTypeOptions } from './AggregateRootTypeOptions';
import { AggregateRootTypesFromDecorators } from './AggregateRootTypesFromDecorators';

/**
 * Decorator to mark a class as an aggregate root.
 * @param {AggregateRootIdLike} aggregateRootId - The identifier of the aggregate root.
 * @param options
 */
export function aggregateRoot(aggregateRootId: AggregateRootIdLike, options: AggregateRootTypeOptions = {}) {
    return function (target: any) {
        const constructor: Constructor<any> = target.prototype.constructor;
        const alias = options.alias !== undefined ? options.alias : constructor.name;
        AggregateRootTypesFromDecorators
            .associate(
                constructor,
                AggregateRootId.from(aggregateRootId),
                Generation.first,
                AggregateRootTypeAlias.from(alias));
    };
}
