// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ExecutionContext, TenantId, TenantIdLike } from '@dolittle/sdk.execution';
import { Logger } from 'winston';
import { Guid } from '@dolittle/rudiments';
import { IEventTypes } from '../../index';
import { IEventStore, EventStore } from '../index';
import { EventStoreClient } from '@dolittle/runtime.contracts/Events/EventStore_grpc_pb';
import { IEventStoreBuilder } from '.';

/**
 * Represents an implementation of {@link IEventStoreBuilder}.
 */
export class EventStoreBuilder extends IEventStoreBuilder{

    /**
     * Initializes a new instance of {@link EventStoreBuilder}.
     * @param {EventStoreClient} eventStoreClient The event store client.
     * @param {IEventTypes} eventTypes The event types.
     * @param {ExecutionContext} executionContext The execution context.
     * @param {Logger} logger The logger.
     */
    constructor(
        private readonly _eventStoreClient: EventStoreClient,
        private readonly _eventTypes: IEventTypes,
        private readonly _executionContext: ExecutionContext,
        private readonly _logger: Logger) {
            super();
    }

    /** @inheritdoc */
    forTenant(tenantId: TenantIdLike): IEventStore {
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
