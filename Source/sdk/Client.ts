// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IEventStore } from '@dolittle/sdk.events';
import { IExecutionContextManager } from '@dolittle/sdk.execution';
import { IArtifacts, Artifacts } from '@dolittle/sdk.artifacts';

export class Client {
    readonly executionContextManager: IExecutionContextManager;
    readonly artifacts: IArtifacts;
    readonly eventStore: IEventStore;

    constructor(executionContextManager: IExecutionContextManager, artifacts: IArtifacts, eventStore: IEventStore) {
        this.executionContextManager = executionContextManager;
        this.artifacts = artifacts;
        this.eventStore = eventStore;
    }
}
