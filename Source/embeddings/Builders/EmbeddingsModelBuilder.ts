// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IClientBuildResults, IModel } from '@dolittle/sdk.common';
import { IEventTypes } from '@dolittle/sdk.events';

import { isEmbeddingModelId } from '../EmbeddingModelId';
import { EmbeddingProcessor } from '../Internal/EmbeddingProcessor';
import { EmbeddingReadModelTypes } from '../Store/EmbeddingReadModelTypes';
import { IEmbeddingReadModelTypes } from '../Store/IEmbeddingReadModelTypes';
import { EmbeddingBuilder } from './EmbeddingBuilder';
import { EmbeddingClassBuilder } from './EmbeddingClassBuilder';

/**
 * Represents a builder that can build {@link EmbeddingProcessor} from an {@link IModel}.
 */
export class EmbeddingsModelBuilder {
    /**
     * Initialises a new instance of the {@link EmbeddingsModelBuilder} class.
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
     * Builds all the embeddings created with the builder.
     * @returns {[EmbeddingProcessor[], IEmbeddingReadModelTypes]} The built embedding processors and read model types.
     */
    build(): [EmbeddingProcessor<any>[], IEmbeddingReadModelTypes] {
        const builders = this._model.getProcessorBuilderBindings(EmbeddingBuilder, EmbeddingClassBuilder);
        const processors: EmbeddingProcessor<any>[] = [];

        for (const { processorBuilder } of builders) {
            const embedding = processorBuilder.build(this._eventTypes, this._buildResults);
            if (embedding !== undefined) {
                processors.push(new EmbeddingProcessor(embedding, this._eventTypes));
            }
        }

        const identifiers = this._model.getTypeBindings(isEmbeddingModelId);
        const readModelTypes = new EmbeddingReadModelTypes();

        for (const { identifier, type } of identifiers) {
            readModelTypes.associate(type, identifier.id);
        }

        return [processors, readModelTypes];
    }

}
