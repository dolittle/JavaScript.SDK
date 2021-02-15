// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { AggregateRootId } from '@dolittle/sdk.events';
import { AggregateRootDecoratedType } from './AggregateRootDecoratedType';
import { AggregateRootDecoratedTypes } from './AggregateRootDecoratedTypes';

/**
 * Decorator to mark a class as an aggregate root
 * @param {AggregateRootId | Guid | string} aggregateRootId The identifier of the aggregate root.
 */
export function aggregateRoot(aggregateRootId: AggregateRootId | Guid | string) {
    return function (target: any) {
        AggregateRootDecoratedTypes.register(
            new AggregateRootDecoratedType(
                AggregateRootId.from(aggregateRootId),
                target));
    };
}
