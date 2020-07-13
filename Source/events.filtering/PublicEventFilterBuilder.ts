// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { Guid } from '@dolittle/rudiments';
import { IArtifacts } from '@dolittle/sdk.artifacts';
import { IExecutionContextManager } from '@dolittle/sdk.execution';

import { FiltersClient } from '@dolittle/runtime.contracts/Runtime/Events.Processing/Filters_grpc_pb';

import { FilterId } from './FilterId';
import { PartitionedFilterEventCallback } from './PartitionedFilterEventCallback';
import { PublicEventFilterProcessor } from './Internal/PublicEventFilterProcessor';
import { MissingFilterCallback } from './MissingFilterCallback';
import { IFilterProcessor } from './IFilterProcessor';

export class PublicEventFilterBuilder {
    private _callback?: PartitionedFilterEventCallback;

    handle(callback: PartitionedFilterEventCallback) {
        this._callback = callback;
    }

    build(filterId: FilterId, client: FiltersClient, executionContextManager: IExecutionContextManager, artifacts: IArtifacts, logger: Logger): IFilterProcessor {
        this.throwIfCallbackIsMissing(filterId);
        return new PublicEventFilterProcessor(filterId, this._callback!, client, executionContextManager, artifacts, logger);
    }

    private throwIfCallbackIsMissing(filterId: FilterId) {
        if (!this._callback) {
            throw new MissingFilterCallback(filterId, Guid.empty);
        }
    }
}
