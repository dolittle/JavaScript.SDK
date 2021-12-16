// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { IClientBuildResults, UniqueBindingBuilder } from '@dolittle/sdk.common';

import { getDecoratedAggregateRootType } from '../aggregateRootDecorator';
import { AggregateRootType } from '../AggregateRootType';
import { AggregateRootTypes } from '../AggregateRootTypes';
import { IAggregateRootTypes } from '../IAggregateRootTypes';
import { IAggregateRootsBuilder } from './IAggregateRootsBuilder';

/**
 * Represents a builder for registering instances of {@link AggregateRootType} from implementations of {@link AggregateRoot}.
 */
export class AggregateRootsBuilder extends IAggregateRootsBuilder {
    private readonly _bindings = new UniqueBindingBuilder<AggregateRootType, Constructor<any>>(
        (aggregateRootType, type, count) => `The aggregate root type ${aggregateRootType} was bound to ${type.name} ${count} times.`,
        (aggregateRootType, types) => `The aggregate root type ${aggregateRootType} was associated with multiple classes (${types.map(_ => _.name).join(', ')}). None of these will be registered.`,
        (type, aggregateRootTypes) => `The class ${type.name} was associated with multiple aggregate root types (${aggregateRootTypes.join(', ')}). None of these will be registered`,
    );

    /** @inheritdoc */
    register<T = any>(type: Constructor<T>): IAggregateRootsBuilder {
        this._bindings.add(getDecoratedAggregateRootType(type), type);
        return this;
    }

    /**
     * Builds an {@link IAggregateRootTypes} from the associated and registered event types.
     * @param {IClientBuildResults} results - For keeping track of build results.
     * @returns {IAggregateRootTypes} The built event types.
     */
    build(results: IClientBuildResults): IAggregateRootTypes {
        const uniqueBindings = this._bindings.buildUnique(results);
        const aggregateRootTypes = new AggregateRootTypes();
        for (const { identifier: aggregateRootType, value: type } of uniqueBindings) {
            aggregateRootTypes.associate(type, aggregateRootType);
        }
        return aggregateRootTypes;
    }
}
