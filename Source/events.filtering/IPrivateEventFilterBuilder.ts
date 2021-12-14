// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import { ScopeId } from '@dolittle/sdk.events';

import { IPartitionedEventFilterBuilder } from './IPartitionedEventFilterBuilder';
import { IUnpartitionedEventFilterBuilder } from './IUnpartitionedEventFilterBuilder';

/**
 * Defines a builder for building a private event filter.
 */
export abstract class IPrivateEventFilterBuilder {
    /**
     * Defines which {@link ScopeId} the filter operates on.
     * @param {ScopeId | Guid | string} scopeId - Scope the filter operates on.
     * @returns {IPrivateEventFilterBuilder} The builder for continuation.
     */
    abstract inScope(scopeId: ScopeId | Guid | string): IPrivateEventFilterBuilder;

    /**
     * Defines the filter to be partitioned.
     * @returns {IPartitionedEventFilterBuilder} The builder for building the partitioned event filter.
     */
    abstract partitioned(): IPartitionedEventFilterBuilder;

    /**
     * Defines the filter to be unpartitioned.
     * @returns {IUnpartitionedEventFilterBuilder} The builder for building the unpartitioned event filter.
     */
    abstract unpartitioned(): IUnpartitionedEventFilterBuilder;
}
