// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IClientBuildResults, IModel } from '@dolittle/sdk.common';

import { IEventTypes } from '@dolittle/sdk.events';

import { ProjectionProcessor } from '../Internal/ProjectionProcessor';
import { ProjectionBuilder } from './ProjectionBuilder';
import { ProjectionClassBuilder } from './ProjectionClassBuilder';

/**
 * Represents a builder that can build {@link ProjectionProcessor} from an {@link IModel}.
 */
export class ProjectionsModelBuilder {
    /**
     * Initialises a new instance of the {@link ProjectionsModelBuilder} class.
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
     * Builds all projections created with the builder.
     * @returns {ProjectionProcessor[]} The built projection processors.
     */
    build(): ProjectionProcessor<any>[] {
        const builders = this._model.getProcessorBuilderBindings(ProjectionBuilder, ProjectionClassBuilder);
        const processors: ProjectionProcessor<any>[] = [];

        for (const { processorBuilder } of builders) {
            const projection = processorBuilder.build(this._eventTypes, this._buildResults);
            if (projection !== undefined) {
                processors.push(new ProjectionProcessor(projection, this._eventTypes));
            }
        }

        return processors;
    }
}