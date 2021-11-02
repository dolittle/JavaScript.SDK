// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ExecutionContext, TenantId } from '@dolittle/sdk.execution';
import { Logger } from 'winston';
import { Guid } from '@dolittle/rudiments';
import { IEventTypes } from '../../index';
import { IEventStore, EventStore } from '../index';
import { EventStoreClient } from '@dolittle/runtime.contracts/Events/EventStore_grpc_pb';

/**
 * Represents a builder for building an event store.
 */
export class EventStoreBuilder {

    constructor(
        private _eventStoreClient: EventStoreClient,
        private _eventTypes: IEventTypes,
        private _executionContext: ExecutionContext,
        private _logger: Logger) {
    }

    /**
     * Build an {@link IEventStore} for the given tenant.
     * @param {TenantId | Guid | string} tenantId The tenant id.
     * @returns {IEventStore} The event store.
     */
    forTenant(tenantId: TenantId | Guid | string): IEventStore {
        const executionContext = this._executionContext
            .forTenant(tenantId)
            .forCorrelation(Guid.create());

        return new EventStore(
            this._eventStoreClient,
            this._eventTypes,
            executionContext,
            this._logger);
    }
}
