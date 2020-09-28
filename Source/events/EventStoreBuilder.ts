// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IArtifacts } from '@dolittle/sdk.artifacts';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { Logger } from 'winston';
import { Guid } from '@dolittle/rudiments';
import { EventStore } from './EventStore';
import { EventStoreClient } from '@dolittle/runtime.contracts/Runtime/Events/EventStore_grpc_pb';
import { IEventStore } from './IEventStore';

export type EventStoreBuilderCallback = (builder: EventStoreBuilder) => void;

/**
 * Represents a builder for building event types, event handlers and event filters.
 */
export class EventStoreBuilder {

    constructor(
        private _eventStoreClient: EventStoreClient,
        private _eventTypes: IArtifacts,
        private _executionContext: ExecutionContext,
        private _logger: Logger) {
        }
    /**
     * Build an {@link IEventStore} for the given tenant.
     *
     * @param {(Guid | string)} tenantId The tenant id.
     * @returns {IEventStore} The event store.
     */
    forTenant(tenantId: Guid | string): IEventStore {
        return new EventStore(
            this._eventStoreClient,
            this._eventTypes,
            this._executionContext.forTenant(tenantId),
            this._logger);
    }
}
