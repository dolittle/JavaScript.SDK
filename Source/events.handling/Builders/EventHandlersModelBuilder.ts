// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IClientBuildResults, IModel } from '@dolittle/sdk.common';
import { IServiceProviderBuilder } from '@dolittle/sdk.dependencyinversion';
import { IEventTypes } from '@dolittle/sdk.events';

import { EventHandlerProcessor } from '../Internal/EventHandlerProcessor';
import { EventHandlerBuilder } from './EventHandlerBuilder';
import { EventHandlerClassBuilder } from './EventHandlerClassBuilder';

/**
 * Represents a builder that can build {@link EventHandlerProcessor} from an {@link IModel}.
 */
export class EventHandlersModelBuilder {
    /**
     * Initialises a new instance of the {@link EventFiltersModelBuilder} class.
     * @param {IModel} _model - The built application model.
     * @param {IClientBuildResults} _buildResults - For keeping track of build results.
     * @param {IEventTypes} _eventTypes - For event types resolution.
     * @param {IServiceProviderBuilder} _bindings - For registering the bindings for the event handler classes.
     */
    constructor(
        private readonly _model: IModel,
        private readonly _buildResults: IClientBuildResults,
        private readonly _eventTypes: IEventTypes,
        private readonly _bindings: IServiceProviderBuilder,
    ) {}

    /**
     * Builds all the event handlers.
     * @returns {EventHandlerProcessor[]} The built event handlers.
     */
    build(): EventHandlerProcessor[] {
        const builders = this._model.getProcessorBuilderBindings(EventHandlerBuilder, EventHandlerClassBuilder);
        const processors: EventHandlerProcessor[] = [];

        for (const { processorBuilder } of builders) {
            const handler = processorBuilder.build(this._eventTypes, this._bindings, this._buildResults);
            if (handler !== undefined) {
                processors.push(new EventHandlerProcessor(handler, this._eventTypes));
            }
        }

        return processors;
    }
}
