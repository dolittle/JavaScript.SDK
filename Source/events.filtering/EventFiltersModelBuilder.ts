// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IClientBuildResults, IModel } from '@dolittle/sdk.common';
import { IEventTypes } from '@dolittle/sdk.events';

import { IFilterProcessor } from './IFilterProcessor';
import { PrivateEventFilterBuilder } from './PrivateEventFilterBuilder';
import { PublicEventFilterBuilder } from './PublicEventFilterBuilder';

/**
 * Represents a builder that can build {@link IFilterProcessor} from an {@link IModel}.
 */
export class EventFiltersModelBuilder {
    /**
     * Initialises a new instance of the {@link EventTypEventFiltersModelBuilderesBuilder} class.
     * @param {IModel} _model - The built application model.
     * @param {IClientBuildResults} _buildResults - For keeping track of build results.
     * @param {IEventTypes} _eventTypes - For event types resolution.
     */
    constructor(
        private readonly _model: IModel,
        private readonly _buildResults: IClientBuildResults,
        private readonly _eventTypes: IEventTypes,
    ) {}

    /**
     * Builds all the event filters.
     * @returns {IFilterProcessor[]} The built filters.
     */
    build(): IFilterProcessor[] {
        const builders = this._model.getProcessorBuilderBindings(PrivateEventFilterBuilder, PublicEventFilterBuilder);
        const processors: IFilterProcessor[] = [];

        for (const { processorBuilder } of builders) {
            const processor = processorBuilder.build(this._eventTypes, this._buildResults);
            if (processor !== undefined) {
                processors.push(processor);
            }
        }

        return processors;
    }
}
