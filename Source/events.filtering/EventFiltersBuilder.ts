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

const getFilterBuilderName = (builder: PrivateEventFilterBuilder | PublicEventFilterBuilder): string => {
    if (builder instanceof PrivateEventFilterBuilder) {
        return 'private callback-filter';
    }
    return 'public callback-filter';
};

const getFilterBuilderNames = (builders: (PrivateEventFilterBuilder | PublicEventFilterBuilder)[]): string => {
    return builders.map(getFilterBuilderName).join(', ');
};

/**
 * Represents an implementation of {@link IEventFiltersBuilder}.
 */
export class EventFiltersBuilder extends IEventFiltersBuilder {
    private readonly _builders = new UniqueBindingBuilder<FilterId, PrivateEventFilterBuilder | PublicEventFilterBuilder>(
        (filterId, builder, count) => `The event filter id ${filterId} was bound to ${getFilterBuilderName(builder)} ${count} times.`,
        (filterId, builders) => `The event filter id ${filterId} was used for multiple filters (${getFilterBuilderNames(builders)}). None of these will be registered.`,
        (builder, filterIds) => `The event filter ${getFilterBuilderName(builder)} was bound to multiple filter ids (${filterIds.join(', ')}). None of these will be registered.`,
    );

    /** @inheritdoc */
    createPrivateFilter(filterId: string | FilterId | Guid, callback: PrivateEventFilterBuilderCallback): IEventFiltersBuilder {
        const identifier = FilterId.from(filterId);
        const builder = new PrivateEventFilterBuilder(identifier);
        this._builders.add(identifier, builder);
        callback(builder);
        return this;
    }

    /** @inheritdoc */
    createPublicFilter(filterId: string | FilterId | Guid, callback: PublicEventFilterBuilderCallback): IEventFiltersBuilder {
        const identifier = FilterId.from(filterId);
        const builder = new PublicEventFilterBuilder(identifier);
        this._builders.add(identifier, builder);
        callback(builder);
        return this;
    }

    /**
     * Builds all the event filters.
     * @param {IEventTypes} eventTypes - For event types resolution.
     * @param {IClientBuildResults} results - For keeping track of build results.
     * @returns {IFilterProcessor[]} The built filters.
     */
    build(eventTypes: IEventTypes, results: IClientBuildResults): IFilterProcessor[] {
        const uniqueBuilders = this._builders.buildUnique(results);
        const processors: IFilterProcessor[] = [];

        for (const { value: builder } of uniqueBuilders) {
            const processor = builder.build(eventTypes, results);
            if (processor !== undefined) {
                processors.push(processor);
            }
        }

        return processors;
    }
}
