// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { IClientBuildResults, IModelBuilder } from '@dolittle/sdk.common';

import { aggregateRoot as aggregateRootDecorator, isDecoratedAggregateRootType, getDecoratedAggregateRootType } from '../aggregateRootDecorator';
import { IAggregateRootsBuilder } from './IAggregateRootsBuilder';
import { AggregateRootModelId } from '../AggregateRootModelId';

/**
 * Represents a builder for registering instances of {@link AggregateRootType} from implementations of {@link AggregateRoot}.
 */
export class AggregateRootsBuilder extends IAggregateRootsBuilder {
    /**
     * Initialises a new instance of the {@link AggregateRootsBuilder} class.
     * @param {IModelBuilder} _modelBuilder - For binding aggregate root types to identifiers.
     * @param {IClientBuildResults} _buildResults - For keeping track of build results.
     */
    constructor(
        private readonly _modelBuilder: IModelBuilder,
        private readonly _buildResults: IClientBuildResults
    ) {
        super();
    }

    /** @inheritdoc */
    register<T = any>(type: Constructor<T>): IAggregateRootsBuilder {
        if (!isDecoratedAggregateRootType(type)) {
            this._buildResults.addFailure(`The aggregate root class ${type.name} is not decorated as an aggregate root`,`Add the @${aggregateRootDecorator.name} decorator to the class`);
            return this;
        }

        const identifier = new AggregateRootModelId(getDecoratedAggregateRootType(type));
        this._modelBuilder.bindIdentifierToType(identifier, type);
        return this;
    }
}
