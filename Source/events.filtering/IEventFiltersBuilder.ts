// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import { FilterId } from './FilterId';
import { IPrivateEventFilterBuilder } from './IPrivateEventFilterBuilder';
import { IPublicEventFilterBuilder } from './IPublicEventFilterBuilder';

/**
 * Defines a builder for building event filters.
 */
export abstract class IEventFiltersBuilder {
    /**
     * Start building for a private filter.
     * @param {FilterId | Guid | string} filterId - The identifier of the filter.
     * @returns {IPrivateEventFilterBuilder} The builder for building the private filter.
     */
    abstract createPrivate(filterId: FilterId | Guid | string): IPrivateEventFilterBuilder;

    /**
     * Start building for a public filter.
     * @param {FilterId | Guid | string} filterId - The identifier of the filter.
     * @returns {IPublicEventFilterBuilder} The builder for building the public filter.
     */
    abstract createPublic(filterId: FilterId | Guid | string): IPublicEventFilterBuilder;
}
