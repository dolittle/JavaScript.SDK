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
     * Builds an {@link IAggregateRootTypes} from the associated and registered aggregate root types.
     * @param {IModel} model - The built application model.
     * @returns {IAggregateRootTypes} The built event types.
     */
    build(model: IModel): IAggregateRootTypes {
        const bindings = model.getTypeBindings(isAggregateRootType);
        const aggregateRootTypes = new AggregateRootTypes();
        for (const { identifier, type } of bindings) {
            aggregateRootTypes.associate(type, identifier);
        }
        return aggregateRootTypes;
    }
}
