// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Artifacts } from '@dolittle/sdk.artifacts';
import { AggregateRootId } from '@dolittle/sdk.events';
import { AggregateRootType } from './AggregateRootType';

/**
 * Defines the system for working with {@link AggregateRootType}.
 */
export abstract class IAggregateRootTypes extends Artifacts<AggregateRootType, AggregateRootId> {
}
