// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EventContext } from '@dolittle/sdk.events';

import { PartitionId } from './PartitionId';

export class PartitionedFilterResult {
    constructor(readonly shouldInclude: boolean, readonly partitionId: PartitionId) {}
}

export type PartitionedFilterEventCallback = (event: any, context: EventContext) => PartitionedFilterResult | Promise<PartitionedFilterResult>;
