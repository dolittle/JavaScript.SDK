// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { AggregateRootId } from '@dolittle/sdk.events';
import { Constructor } from '@dolittle/types';

/**
 * Represents an aggregate root created from the decorator.
 */
export class AggregateRootDecoratedType {
    constructor(readonly aggregateRootId: AggregateRootId, readonly type: Constructor<any>) {
    }
}
