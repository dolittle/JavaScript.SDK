// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import { IClientBuildResults, IModelBuilder } from '@dolittle/sdk.common';

import { FilterId } from './FilterId';
import { PublicEventFilterBuilder } from './PublicEventFilterBuilder';
import { PrivateEventFilterBuilder } from './PrivateEventFilterBuilder';
import { IEventFiltersBuilder } from './IEventFiltersBuilder';
import { IPrivateEventFilterBuilder } from './IPrivateEventFilterBuilder';
import { IPublicEventFilterBuilder } from './IPublicEventFilterBuilder';

/**
 * Represents an implementation of {@link IEventFiltersBuilder}.
 */
export class EventFiltersBuilder extends IEventFiltersBuilder {
    /**
     * Initialises a new instance of the {@link EventFiltersBuilder} class.
     * @param {IModelBuilder} _modelBuilder - For binding event filters to identifiers.
     * @param {IClientBuildResults} _buildResults - For keeping track of build results.
     */
    constructor(
        private readonly _modelBuilder: IModelBuilder,
        private readonly _buildResults: IClientBuildResults
    ) {
        super();
    }

    /** @inheritdoc */
    createPrivate(filterId: string | FilterId | Guid): IPrivateEventFilterBuilder {
        const identifier = FilterId.from(filterId);
        return new PrivateEventFilterBuilder(identifier, this._modelBuilder);
    }

    /** @inheritdoc */
    createPublic(filterId: string | FilterId | Guid): IPublicEventFilterBuilder {
        const identifier = FilterId.from(filterId);
        return new PublicEventFilterBuilder(identifier, this._modelBuilder);
    }
}
