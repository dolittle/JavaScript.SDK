// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IEventStore } from '@dolittle/sdk.events';
import { IExecutionContextManager } from '@dolittle/sdk.execution';
import { IArtifacts } from '@dolittle/sdk.artifacts';

/**
 * Represents the client for working with the Dolittle Runtime
 */
export class Client {
    readonly executionContextManager: IExecutionContextManager;
    readonly artifacts: IArtifacts;
    readonly eventStore: IEventStore;

    /**
     * Creates an instance of client.
     * @param {IExecutionContextManager} executionContextManager The execution context manager.
     * @param {IArtifacts} artifacts All the configured artifacts.
     * @param {IEventStore} eventStore The eventstore to work with.
     */
    constructor(executionContextManager: IExecutionContextManager, artifacts: IArtifacts, eventStore: IEventStore) {
        this.executionContextManager = executionContextManager;
        this.artifacts = artifacts;
        this.eventStore = eventStore;
    }
}
