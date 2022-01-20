// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { ScopeId } from '@dolittle/sdk.events';

import { IProjectionBuilderForReadModel } from './IProjectionBuilderForReadModel';

/**
 * Defines a builder for building a projection from method callbacks.
 */
export abstract class IProjectionBuilder {
    /**
     * Defines the projection to operate on a specific {@link ScopeId}.
     * @param {ScopeId | Guid | string} scopeId - Scope the projection operates on.
     * @returns {IProjectionBuilder} The builder for continuation.
     */
    abstract inScope(scopeId: ScopeId | Guid | string): IProjectionBuilder;

    /**
     * Defines the type of the read model the projection builds. The initial state of a newly
     * created read model is given by the provided instance or an instance constructed by
     * the default constructor of the provided type.
     * @param {Constructor<T> | T} typeOrInstance - The type or an instance of the read model.
     * @returns {IProjectionBuilderForReadModel<T>} The projection builder for the specified read model type.
     * @template T The type of the projection read model.
     */
    abstract forReadModel<T>(typeOrInstance: Constructor<T> | T): IProjectionBuilderForReadModel<T>;
}
