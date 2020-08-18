// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { IArtifacts } from '@dolittle/sdk.artifacts';
import { ScopeId } from '@dolittle/sdk.events';
import { IExecutionContextManager } from '@dolittle/sdk.execution';

import { FiltersClient } from '@dolittle/runtime.contracts/Runtime/Events.Processing/Filters_grpc_pb';

import { FilterId } from './FilterId';
import { FilterEventCallback } from './FilterEventCallback';
import { EventFilterProcessor } from './Internal/EventFilterProcessor';
import { MissingFilterCallback } from './MissingFilterCallback';
import { IFilterProcessor } from './IFilterProcessor';

export class UnpartitionedEventFilterBuilder {
    private _callback?: FilterEventCallback;

    handle(callback: FilterEventCallback) {
        this._callback = callback;
    }

    build(filterId: FilterId, scopeId: ScopeId, client: FiltersClient, executionContextManager: IExecutionContextManager, artifacts: IArtifacts, logger: Logger): IFilterProcessor {
        this.throwIfCallbackIsMissing(filterId, scopeId);
        return new EventFilterProcessor(filterId, scopeId, this._callback!, client, executionContextManager, artifacts, logger);
    }

    private throwIfCallbackIsMissing(filterId: FilterId, scopeId: ScopeId) {
        if (!this._callback) {
            throw new MissingFilterCallback(filterId, scopeId);
        }
    }
}
