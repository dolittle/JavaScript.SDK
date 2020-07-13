// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { Guid } from '@dolittle/rudiments';
import { IArtifacts } from '@dolittle/sdk.artifacts';
import { ScopeId } from '@dolittle/sdk.events.handling';
import { IExecutionContextManager } from '@dolittle/sdk.execution';

import { FiltersClient } from '@dolittle/runtime.contracts/Runtime/Events.Processing/Filters_grpc_pb';

import { PartitionedEventFilterBuilder } from './PartitionedEventFilterBuilder';
import { UnpartitionedEventFilterBuilder } from './UnpartitionedEventFilterBuilder';
import { FilterEventCallback } from './FilterEventCallback';
import { FilterId } from './FilterId';
import { IFilterProcessor } from './IFilterProcessor';
import { FilterDefinitionIncomplete } from './FilterDefinitionIncomplete';

export class PrivateEventFilterBuilder {
    private _scopeId: ScopeId = Guid.empty;
    private _innerBuilder?: PartitionedEventFilterBuilder | UnpartitionedEventFilterBuilder;

    get scopeId() {
        return this._scopeId;
    }

    inScope(scopeId: ScopeId): PrivateEventFilterBuilder {
        this._scopeId = scopeId;
        return this;
    }

    partitioned(): PartitionedEventFilterBuilder {
        this._innerBuilder = new PartitionedEventFilterBuilder();
        return this._innerBuilder;
    }

    handle(callback: FilterEventCallback) {
        this._innerBuilder = new UnpartitionedEventFilterBuilder();
        this._innerBuilder.handle(callback);
    }


    build(filterId: FilterId, client: FiltersClient, executionContextManager: IExecutionContextManager, artifacts: IArtifacts, logger: Logger): IFilterProcessor {
        if (!this._innerBuilder) {
            throw new FilterDefinitionIncomplete(filterId, 'call partitioned() or handle(...).');
        }
        return this._innerBuilder.build(filterId, this._scopeId, client, executionContextManager, artifacts, logger);
    }
}
