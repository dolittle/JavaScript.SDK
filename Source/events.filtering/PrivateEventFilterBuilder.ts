// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import { IClientBuildResults } from '@dolittle/sdk.common';
import { IEventTypes, ScopeId } from '@dolittle/sdk.events';

import { FilterId } from './FilterId';
import { IFilterProcessor } from './IFilterProcessor';
import { IPartitionedEventFilterBuilder } from './IPartitionedEventFilterBuilder';
import { IPrivateEventFilterBuilder } from './IPrivateEventFilterBuilder';
import { IUnpartitionedEventFilterBuilder } from './IUnpartitionedEventFilterBuilder';
import { PartitionedEventFilterBuilder } from './PartitionedEventFilterBuilder';
import { UnpartitionedEventFilterBuilder } from './UnpartitionedEventFilterBuilder';

/**
 * Represents the builder for building private event filters.
 */
export class PrivateEventFilterBuilder extends IPrivateEventFilterBuilder {
    private _scopeId: ScopeId = ScopeId.default;
    private _innerBuilder?: PartitionedEventFilterBuilder | UnpartitionedEventFilterBuilder;

    /**
     * Initializes a new instance of {@link PrivateEventFilterBuilder}.
     * @param {FilterId} _filterId - Identifier of the filter.
     */
    constructor(private _filterId: FilterId) {
        super();
    }

    /** @inheritdoc */
    inScope(scopeId: ScopeId | Guid | string): IPrivateEventFilterBuilder {
        this._scopeId = ScopeId.from(scopeId);
        return this;
    }

    /** @inheritdoc */
    partitioned(): IPartitionedEventFilterBuilder {
        this._innerBuilder = new PartitionedEventFilterBuilder();
        return this._innerBuilder;
    }

    /** @inheritdoc */
    unpartitioned(): IUnpartitionedEventFilterBuilder {
        this._innerBuilder = new UnpartitionedEventFilterBuilder();
        return this._innerBuilder;
    }

    /**
     * Build an instance of a {@link IFilterProcessor}.
     * @param {IEventTypes} eventTypes - For event types resolution.
     * @param {IClientBuildResults} results - For keeping track of build results.
     * @returns {IFilterProcessor | undefined} The built filter processor if successful.
     */
    build(eventTypes: IEventTypes, results: IClientBuildResults): IFilterProcessor | undefined {
        if (this._innerBuilder === undefined) {
            results.addFailure(`Filter configuration for private filter '${this._filterId}' is incomplete`, 'Call partitioned() or unpartitioned() on the builder to complete the filter configuration');
            return;
        }

        return this._innerBuilder.build(this._filterId, this._scopeId, eventTypes, results);
    }
}
