// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { IEventStoreBuilder, IEventTypes } from '@dolittle/sdk.events';
import { TenantId } from '@dolittle/sdk.execution';

import { IAggregateRootTypes } from '../IAggregateRootTypes';
import { IAggregates } from './IAggregates';
import { Aggregates } from './Aggregates';
import { IAggregatesBuilder } from './IAggregatesBuilder';

/**
 * Represents an implementation of {@link IAggregatesBuilder}.
 */
export class AggregatesBuilder extends IAggregatesBuilder {
    /**
     * Initialises a new instance of the {@link AggregatesBuilder} class.
     * @param {IAggregateRootTypes} _aggregateRootTypes - For aggregate root types resolution.
     * @param {IEventTypes} _eventTypes - For event types resolution.
     * @param {IEventStoreBuilder} _eventStoreBuilder - The builder to use for getting the event store for a specific tenant.
     * @param {Logger} _logger - For logging.
     */
    constructor(
        private readonly _aggregateRootTypes: IAggregateRootTypes,
        private readonly _eventTypes: IEventTypes,
        private readonly _eventStoreBuilder: IEventStoreBuilder,
        private readonly _logger: Logger,
    ) {
        super();
    }

    /** @inheritdoc */
    forTenant(tenant: TenantId): IAggregates {
        return new Aggregates(
            this._aggregateRootTypes,
            this._eventTypes,
            this._eventStoreBuilder.forTenant(tenant),
            this._logger);
    }
}
