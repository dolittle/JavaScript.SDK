// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { IEmbeddingBuilderForReadModel } from './IEmbeddingBuilderForReadModel';

/**
 * Defines a builder for building an embedding from method callbacks.
 */
export abstract class IEmbeddingBuilder {
    /**
     * Defines the type of the read model the embedding builds. The initial state of a newly
     * created read model is given by the provided instance or an instance constructed by
     * the default constructor of the provided type.
     * @param {Constructor<T> | T} typeOrInstance - The type or an instance of the read model.
     * @returns {IEmbeddingBuilderForReadModel<T>} The embedding builder for the specified read model type.
     * @template T The type of the embedding read model.
     */
    abstract forReadModel<T>(typeOrInstance: Constructor<T> | T): IEmbeddingBuilderForReadModel<T>;
}
