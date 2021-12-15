// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IClientBuildResults } from '../ClientSetup/IClientBuildResults';
import { Binding } from './Binding';

/**
 * Defines a system that can build bindings between identifiers and values, ensuring they are unique and without conflicting bindings.
 * @template TIdentifier The type of the identifier.
 * @template TValue The type of the value.
 */
export abstract class ICanBuildUniqueBindings<TIdentifier, TValue> {
    /**
     * Adds a binding between the given identifier and value to the builder.
     * @param {TIdentifier} identifier - The identifier of the binding.
     * @param {TValue} value - The value of the binding.
     */
    abstract add(identifier: TIdentifier, value: TValue): void;

    /**
     * Builds a set of unique bindings from the bindings added to the builder.
     * Duplicate bindings are de-duplicated, and conflicting bindings will not be returned.
     * @param {IClientBuildResults} results - The results to add failures to when conflicting bindings are encountered.
     * @returns {Binding<TIdentifier, TValue>} The unique set of bindings.
     */
    abstract buildUnique(results: IClientBuildResults): Binding<TIdentifier, TValue>[];
}
