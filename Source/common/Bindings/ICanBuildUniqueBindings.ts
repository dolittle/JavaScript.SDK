// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { IClientBuildResults } from '../ClientSetup/IClientBuildResults';
import { Binding } from './Binding';

/**
 * Defines a system that can build bindings between an identifier and a type - with a value. Ensuring they are unique and without conflicting bindings.
 * @template TIdentifier The type of the identifiers.
 * @template TValue The type of the values.
 */
export abstract class ICanBuildUniqueBindings<TIdentifier, TValue> {
    /**
     * Adds a binding between the given identifier and type to the builder, with the value.
     * @param {TIdentifier} identifier - The identifier to bind.
     * @param {Constructor<any>} type - The type to bind.
     * @param {TValue} value - The value of the binding.
     */
    abstract add(identifier: TIdentifier, type: Constructor<any>, value: TValue): void;

    /**
     * Builds a set of unique bindings from the bindings added to the builder.
     * Duplicate bindings are de-duplicated, and conflicting bindings will not be returned.
     * @param {IClientBuildResults} results - The results to add failures to when conflicting bindings are encountered.
     * @returns {Binding<TIdentifier, TValue>} The unique set of bindings.
     */
    abstract buildUnique(results: IClientBuildResults): readonly Binding<TIdentifier, TValue>[];
}
