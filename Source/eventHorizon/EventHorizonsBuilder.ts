// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { TenantId, IExecutionContextManager } from '@dolittle/sdk.execution';
import { TenantSubscriptionsBuilder, TenantSubscriptionsBuilderCallback } from './TenantSubscriptionsBuilder';
import { IEventHorizons } from './IEventHorizons';
import { EventHorizons } from './EventHorizons';

import { SubscriptionsClient } from '@dolittle/runtime.contracts/Runtime/EventHorizon/Subscriptions_grpc_pb';
import { Logger } from 'winston';

export type EventHorizonsBuilderCallback = (builder: EventHorizonsBuilder) => void;

/**
 * Represents a builder for building event horizons
 */
export class EventHorizonsBuilder {
    readonly _tenantSubscriptionsBuilders: TenantSubscriptionsBuilder[] = [];

    /**
     * Configure subscriptions for a tenant in our microservice.
     * @param {TenantId} tenant The tenant in our microservice.
     * @param {TenantSubscriptionsBuilderCallback} callback The subscriptions builder callback.
     * @returns {EventHorizonsBuilder}
     * @summary Two microservices does not need to be aligned on tenancy. This allows for that purpose.
     */
    forTenant(tenant: TenantId, callback: TenantSubscriptionsBuilderCallback): EventHorizonsBuilder {
        const builder = new TenantSubscriptionsBuilder(tenant);
        callback(builder);
        this._tenantSubscriptionsBuilders.push(builder);
        return this;
    }

    /**
     * Build all configured {@link TenantSubscriptions}
     * @param {SubscriptionsClient} subscriptionsClient The runtime client for working with subscriptions.
     * @param {IExecutionContextManager} executionContextManager For Managing execution context.
     * @param {Logger} logger Logger for logging;
     * @returns {TenantSubscriptions[]}
     */
    build(subscriptionsClient: SubscriptionsClient, executionContextManager: IExecutionContextManager, logger: Logger): IEventHorizons {
        const tenantSubscriptions = this._tenantSubscriptionsBuilders.map(_ => _.build());
        return new EventHorizons(subscriptionsClient, executionContextManager, tenantSubscriptions, logger);
    }
}
