// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IModel } from '@dolittle/sdk.common';
import { IServiceProviderBuilder } from '@dolittle/sdk.dependencyinversion';

import { AggregateRootTypes } from '../AggregateRootTypes';
import { isAggregateRootModelId } from '../AggregateRootModelId';
import { IAggregateRootTypes } from '../IAggregateRootTypes';
import { IAggregateOf } from '../IAggregateOf';
import { IAggregates } from './IAggregates';

/**
 * Represents a builder that can build {@link IAggregateRootTypes} from an {@link IModel}.
 */
export class AggregateRootsModelBuilder {
    /**
     * Initialises a new instance of the {@link AggregateRootsModelBuilder} class.
     * @param {IModel} _model - The built application model.
     * @param {IServiceProviderBuilder} _bindings - For registering the bindings for {@link IAggregateOf} types.
     */
    constructor(
        private readonly _model: IModel,
        private readonly _bindings: IServiceProviderBuilder,
    ) {}

    /**
     * Builds an {@link IAggregateRootTypes} from the associated and registered aggregate root types.
     * @returns {IAggregateRootTypes} The built event types.
     */
    build(): IAggregateRootTypes {
        const bindings = this._model.getTypeBindings(isAggregateRootModelId);
        const aggregateRootTypes = new AggregateRootTypes();
        for (const { identifier, type } of bindings) {
            aggregateRootTypes.associate(type, identifier.aggregateRootType);

            this._bindings.addTenantServices(binder => {
                binder.bind(IAggregateOf.for(type)).toFactory(services => services.get(IAggregates).of(type));
            });
        }
        return aggregateRootTypes;
    }
}
