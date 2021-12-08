// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IEventTypes, ScopeId } from '@dolittle/sdk.events';

import { PartitionedEventFilterBuilder } from './PartitionedEventFilterBuilder';
import { UnpartitionedEventFilterBuilder } from './UnpartitionedEventFilterBuilder';
import { FilterId } from './FilterId';
import { IFilterProcessor } from './IFilterProcessor';
import { FilterDefinitionIncomplete } from './FilterDefinitionIncomplete';
import { Guid } from '@dolittle/rudiments';

/**
 * Represents the builder for building private event filters.
 */
export class PrivateEventFilterBuilder {
    private _scopeId: ScopeId = ScopeId.default;
    private _innerBuilder?: PartitionedEventFilterBuilder | UnpartitionedEventFilterBuilder;

    /**
     * Initializes a new instance of {@link PrivateEventFilterBuilder}.
     * @param {FilterId} _filterId - Identifier of the filter.
     */
    constructor(private _filterId: FilterId) {}

    /**
     * Defines which {@link ScopeId} the filter operates on.
     * @param {ScopeId | Guid | string} scopeId - Scope the filter operates on.
     * @returns {PrivateEventFilterBuilder} The builder for continuation.
     */
    inScope(scopeId: ScopeId | Guid | string): PrivateEventFilterBuilder {
        this._scopeId = ScopeId.from(scopeId);
        return this;
    }

    /**
     * Defines the filter to be partitioned.
     * @returns {PrivateEventFilterBuilder} The builder for continuation.
     */
    partitioned(): PartitionedEventFilterBuilder {
        this._innerBuilder = new PartitionedEventFilterBuilder();
        return this._innerBuilder;
    }

    /**
     * Defines the filter to be unpartitioned.
     * @returns {PrivateEventFilterBuilder} The builder for continuation.
     */
    unpartitioned(): UnpartitionedEventFilterBuilder {
        this._innerBuilder = new UnpartitionedEventFilterBuilder();
        return this._innerBuilder;
    }

    /**
     * Build an instance of a {@link IFilterProcessor}.
     * @param {IEventTypes} eventTypes - Event types for identifying event types.
     * @returns {IFilterProcessor} The built filter processor.
     */
    build(
        eventTypes: IEventTypes,
    ): IFilterProcessor {
        if (!this._innerBuilder) {
            throw new FilterDefinitionIncomplete(this._filterId, 'call partitioned() or unpartitioned().');
        }
        return this._innerBuilder.build(this._filterId, this._scopeId, eventTypes);
    }
}
