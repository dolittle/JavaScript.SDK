// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IModel } from '@dolittle/sdk.common';

import { AggregateRootTypes } from '../AggregateRootTypes';
import { IAggregateRootTypes } from '../IAggregateRootTypes';
import { isAggregateRootType } from '../AggregateRootType';

/**
 * Represents a builder that can build {@link IAggregateRootTypes} from an {@link IModel}.
 */
export class AggregateRootsModelBuilder {
    /**
     * Initialises a new instance of the {@link AggregateRootsModelBuilder} class.
     * @param {IModel} _model - The built application model.
     */
    constructor(
        private readonly _model: IModel,
    ) {}

    /**
     * Builds an {@link IAggregateRootTypes} from the associated and registered aggregate root types.
     * @returns {IAggregateRootTypes} The built event types.
     */
    build(): IAggregateRootTypes {
        const bindings = this._model.getTypeBindings(isAggregateRootType);
        const aggregateRootTypes = new AggregateRootTypes();
        for (const { identifier, type } of bindings) {
            aggregateRootTypes.associate(type, identifier);
        }
        return aggregateRootTypes;
    }
}
