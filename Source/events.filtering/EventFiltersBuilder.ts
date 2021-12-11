// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import { IEventTypes } from '@dolittle/sdk.events';

import { FilterId } from './FilterId';
import { PublicEventFilterBuilder } from './PublicEventFilterBuilder';
import { PrivateEventFilterBuilder } from './PrivateEventFilterBuilder';
import { PublicEventFilterBuilderCallback } from './PublicEventFilterBuilderCallback';
import { PrivateEventFilterBuilderCallback } from './PrivateEventFilterBuilderCallback';
import { IEventFiltersBuilder } from './IEventFiltersBuilder';
import { IFilterProcessor } from './IFilterProcessor';

/**
 * Represents an implementation of {@link IEventFiltersBuilder}.
 */
export class EventFiltersBuilder extends IEventFiltersBuilder {
    private _privateFilterBuilders: PrivateEventFilterBuilder[]  = [];
    private _publicFilterBuilders: PublicEventFilterBuilder[]  = [];

    /** @inheritdoc */
    createPrivateFilter(filterId: string | FilterId | Guid, callback: PrivateEventFilterBuilderCallback): IEventFiltersBuilder {
        const builder = new PrivateEventFilterBuilder(FilterId.from(filterId));
        callback(builder);
        this._privateFilterBuilders.push(builder);
        return this;
    }

    /** @inheritdoc */
    createPublicFilter(filterId: string | FilterId | Guid, callback: PublicEventFilterBuilderCallback): IEventFiltersBuilder {
        const builder = new PublicEventFilterBuilder(FilterId.from(filterId));
        callback(builder);
        this._publicFilterBuilders.push(builder);
        return this;
    }

    /**
     * Builds all the event filters.
     * @param {IEventTypes} eventTypes - For event types resolution.
     * @returns {IFilterProcessor[]} The built filters.
     */
    build(
        eventTypes: IEventTypes
    ): IFilterProcessor[] {
        const processors: IFilterProcessor[] = [];

        for (const privateFilterBuilder of this._privateFilterBuilders) {
            const filterProcessor = privateFilterBuilder.build(eventTypes);
            processors.push(filterProcessor);
        }
        for (const publicFilterBuilder of this._publicFilterBuilders) {
            const filterProcessor = publicFilterBuilder.build(eventTypes);
            processors.push(filterProcessor);
        }

        return processors;
    }
}
