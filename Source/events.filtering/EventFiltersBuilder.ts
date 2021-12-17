// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import { IClientBuildResults, UniqueBindingBuilder } from '@dolittle/sdk.common';
import { IEventTypes } from '@dolittle/sdk.events';

import { FilterId } from './FilterId';
import { PublicEventFilterBuilder } from './PublicEventFilterBuilder';
import { PrivateEventFilterBuilder } from './PrivateEventFilterBuilder';
import { PublicEventFilterBuilderCallback } from './PublicEventFilterBuilderCallback';
import { PrivateEventFilterBuilderCallback } from './PrivateEventFilterBuilderCallback';
import { IEventFiltersBuilder } from './IEventFiltersBuilder';
import { IFilterProcessor } from './IFilterProcessor';

type Builder = PrivateEventFilterBuilder | PublicEventFilterBuilder;

const getBuilderName = (builder: Builder): string => {
    if (builder instanceof PrivateEventFilterBuilder) {
        return 'private callback-filter';
    }
    return 'public callback-filter';
};

/**
 * Represents an implementation of {@link IEventFiltersBuilder}.
 */
export class EventFiltersBuilder extends IEventFiltersBuilder {
    private readonly _builders = new UniqueBindingBuilder<FilterId, Builder>('event filter', getBuilderName);

    /**
     * Initialises a new instance of the {@link EventTypesBuilder} class.
     * @param {IClientBuildResults} _buildResults - For keeping track of build results.
     */
    constructor(private readonly _buildResults: IClientBuildResults) {
        super();
    }

    /** @inheritdoc */
    createPrivateFilter(filterId: string | FilterId | Guid, callback: PrivateEventFilterBuilderCallback): IEventFiltersBuilder {
        const identifier = FilterId.from(filterId);
        const builder = new PrivateEventFilterBuilder(identifier);
        this._builders.add(identifier, class {}, builder);
        callback(builder);
        return this;
    }

    /** @inheritdoc */
    createPublicFilter(filterId: string | FilterId | Guid, callback: PublicEventFilterBuilderCallback): IEventFiltersBuilder {
        const identifier = FilterId.from(filterId);
        const builder = new PublicEventFilterBuilder(identifier);
        this._builders.add(identifier, class {}, builder);
        callback(builder);
        return this;
    }

    /**
     * Builds all the event filters.
     * @param {IEventTypes} eventTypes - For event types resolution.
     * @returns {IFilterProcessor[]} The built filters.
     */
    build(eventTypes: IEventTypes): IFilterProcessor[] {
        const uniqueBuilders = this._builders.buildUnique(this._buildResults);
        const processors: IFilterProcessor[] = [];

        for (const { value: builder } of uniqueBuilders) {
            const processor = builder.build(eventTypes, this._buildResults);
            if (processor !== undefined) {
                processors.push(processor);
            }
        }

        return processors;
    }
}
