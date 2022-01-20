// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid, IEquatable } from '@dolittle/rudiments';

import { IClientBuildResults, IModelBuilder } from '@dolittle/sdk.common';
import { IEventTypes, ScopeId } from '@dolittle/sdk.events';

import { FilterId } from './FilterId';
import { FilterModelId } from './FilterModelId';
import { IFilterProcessor } from './IFilterProcessor';
import { IPartitionedEventFilterBuilder } from './IPartitionedEventFilterBuilder';
import { IPrivateEventFilterBuilder } from './IPrivateEventFilterBuilder';
import { IUnpartitionedEventFilterBuilder } from './IUnpartitionedEventFilterBuilder';
import { PartitionedEventFilterBuilder } from './PartitionedEventFilterBuilder';
import { UnpartitionedEventFilterBuilder } from './UnpartitionedEventFilterBuilder';

/**
 * Represents the builder for building private event filters.
 */
export class PrivateEventFilterBuilder extends IPrivateEventFilterBuilder implements IEquatable {
    private _scopeId: ScopeId = ScopeId.default;
    private _innerBuilder?: PartitionedEventFilterBuilder | UnpartitionedEventFilterBuilder;

    /**
     * Initializes a new instance of {@link PrivateEventFilterBuilder}.
     * @param {FilterId} _filterId - Identifier of the filter.
     * @param {IModelBuilder} _modelBuilder - For binding the event filter to its identifier.
     */
    constructor(private readonly _filterId: FilterId, private readonly _modelBuilder: IModelBuilder) {
        super();
        this._modelBuilder.bindIdentifierToProcessorBuilder(this._modelId, this);
    }

    /** @inheritdoc */
    inScope(scopeId: ScopeId | Guid | string): IPrivateEventFilterBuilder {
        this._modelBuilder.unbindIdentifierFromProcessorBuilder(this._modelId, this);
        this._scopeId = ScopeId.from(scopeId);
        this._modelBuilder.bindIdentifierToProcessorBuilder(this._modelId, this);
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

    /** @inheritdoc */
    equals(other: any): boolean {
        return this === other;
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

    private get _modelId(): FilterModelId {
        return new FilterModelId(this._filterId, this._scopeId);
    }
}
