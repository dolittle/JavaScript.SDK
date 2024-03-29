// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Db, Collection } from 'mongodb';

import { IClientBuildResults, IModel } from '@dolittle/sdk.common';
import { IServiceProviderBuilder } from '@dolittle/sdk.dependencyinversion';
import { IEventTypes } from '@dolittle/sdk.events';
import '@dolittle/sdk.resources';

import { ProjectionProcessor } from '../Internal/ProjectionProcessor';
import { IProjectionReadModelTypes } from '../Store/IProjectionReadModelTypes';
import { ProjectionReadModelTypes } from '../Store/ProjectionReadModelTypes';
import { ProjectionBuilder } from './ProjectionBuilder';
import { ProjectionClassBuilder } from './ProjectionClassBuilder';
import { isProjectionModelId } from '../ProjectionModelId';
import { IProjectionStore } from '../Store/IProjectionStore';
import { IProjectionOf } from '../Store/IProjectionOf';

/**
 * Represents a builder that can build {@link ProjectionProcessor} from an {@link IModel}.
 */
export class ProjectionsModelBuilder {
    /**
     * Initialises a new instance of the {@link ProjectionsModelBuilder} class.
     * @param {IModel} _model - The built application model.
     * @param {IClientBuildResults} _buildResults - For keeping track of build results.
     * @param {IEventTypes} _eventTypes - For event types resolution.
     * @param {IServiceProviderBuilder} _bindings - For registering the bindings for {@link IProjectionOf} types.
     */
    constructor(
        private readonly _model: IModel,
        private readonly _buildResults: IClientBuildResults,
        private readonly _eventTypes: IEventTypes,
        private readonly _bindings: IServiceProviderBuilder
    ) {}

    /**
     * Builds all projections created with the builder.
     * @returns {[ProjectionProcessor[], IProjectionReadModelTypes]} The built projection processors and read model types.
     */
    build(): [ProjectionProcessor<any>[], IProjectionReadModelTypes] {
        const builders = this._model.getProcessorBuilderBindings(ProjectionBuilder, ProjectionClassBuilder);
        const processors: ProjectionProcessor<any>[] = [];

        for (const { processorBuilder } of builders) {
            const projection = processorBuilder.build(this._eventTypes, this._buildResults);
            if (projection !== undefined) {
                processors.push(new ProjectionProcessor(projection, this._eventTypes));

                if (projection.copies.mongoDB.shouldCopyToMongoDB && projection.readModelType !== undefined) {
                    this._bindings.addTenantServices(binder => {
                        binder.bind(Collection.forReadModel(projection.readModelType!)).toFactory(services => services.get(Db).collection(projection.copies.mongoDB.collectionName.value));
                    });
                }
            }
        }

        const identifiers = this._model.getTypeBindings(isProjectionModelId);
        const readModelTypes = new ProjectionReadModelTypes();
        for (const { identifier, type } of identifiers) {
            readModelTypes.associate(type, identifier.id, identifier.scope);
            this._bindings.addTenantServices(binder => {
                binder.bind(IProjectionOf.for(type)).toFactory(services => services.get(IProjectionStore).of(type, identifier.id, identifier.scope));
            });
        }
        return [processors, readModelTypes];
    }
}
