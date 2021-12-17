// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { IClientBuildResults, UniqueBindingBuilder } from '@dolittle/sdk.common';

import { aggregateRoot as aggregateRootDecorator, isDecoratedAggregateRootType, getDecoratedAggregateRootType } from '../aggregateRootDecorator';
import { AggregateRootType } from '../AggregateRootType';
import { AggregateRootTypes } from '../AggregateRootTypes';
import { IAggregateRootTypes } from '../IAggregateRootTypes';
import { IAggregateRootsBuilder } from './IAggregateRootsBuilder';

/**
 * Represents a builder for registering instances of {@link AggregateRootType} from implementations of {@link AggregateRoot}.
 */
export class AggregateRootsBuilder extends IAggregateRootsBuilder {
    private readonly _bindings = new UniqueBindingBuilder<AggregateRootType, Constructor<any>>('aggregate root type', type => type.name);

    /**
     * Initialises a new instance of the {@link AggregateRootsBuilder} class.
     * @param {IClientBuildResults} _buildResults - For keeping track of build results.
     */
    constructor(private readonly _buildResults: IClientBuildResults) {
        super();
    }

    /** @inheritdoc */
    register<T = any>(type: Constructor<T>): IAggregateRootsBuilder {
        if (!isDecoratedAggregateRootType(type)) {
            this._buildResults.addFailure(`The aggregate root class ${type.name} is not decorated as an aggregate root`,`Add the @${aggregateRootDecorator.name} decorator to the class`);
            return this;
        }

        this._bindings.add(getDecoratedAggregateRootType(type), type, type);
        return this;
    }

    /**
     * Builds an {@link IAggregateRootTypes} from the associated and registered event types.
     * @returns {IAggregateRootTypes} The built event types.
     */
    build(): IAggregateRootTypes {
        const uniqueBindings = this._bindings.buildUnique(this._buildResults);
        const aggregateRootTypes = new AggregateRootTypes();
        for (const { identifier: aggregateRootType, type } of uniqueBindings) {
            aggregateRootTypes.associate(type, aggregateRootType);
        }
        return aggregateRootTypes;
    }
}
