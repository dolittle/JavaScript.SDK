// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EventContext } from '@dolittle/sdk.events';

import { PartitionedFilterResult } from './PartitionedFilterResult';

/**
 *
 */
export type PartitionedFilterEventCallback = (event: any, context: EventContext) => PartitionedFilterResult | Promise<PartitionedFilterResult>;
