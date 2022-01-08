// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { AnyIdentifier } from './Identifier';
import { ProcessorBuilder } from './ProcessorBuilder';

/**
 * Represents the binding of an identifier to either a type, a processor builder or both.
 */
export type Binding = {
    /**
     * The identifier that is bound.
     */
    identifier: AnyIdentifier;

    /**
     * The optional type that the identifier is bound to.
     */
    type?: Constructor<any>;

    /**
     * The optional processor builder that the identifier is bound to.
     */
    processorBuilder?: ProcessorBuilder;
};

/**
 * Represents a binding for a specific type of identifier to a type.
 * @template T The type of the identifier.
 */
export type TypeBinding<T> = {
    /**
     * The identifier that is bound.
     */
    identifier: T;

    /**
     * The type that the identifier is bound to.
     */
    type: Constructor<any>;
};

/**
 * Represents a binding for an identifier to a processor builder.
 */
export type ProcessorBuilderBinding<T> = {
    /**
     * The identifier that is bound.
     */
    identifier: AnyIdentifier;

    /**
     * The processor builder that the identifier is bound to.
     */
    processorBuilder: T;
};

/**
 * Defines a Dolittle application model.
 */
export abstract class IModel {
    /**
     * Gets the valid bindings.
     */
    abstract get bindings(): readonly Binding[];

    /**
     * Gets the bindings for a specific kind of identifier to types.
     * @param {(any) => boolean} predicate - The type predicate to determine the kind of the identifier.
     * @returns {TypeBinding<T>[]} The bound types.
     * @template T The type of the identifier.
     */
    abstract getTypeBindings<T extends AnyIdentifier>(predicate: (identifier: any) => identifier is T): readonly TypeBinding<T>[];

    /**
     * Gets the bindings for specific kinds of processor builders.
     * @param {Constructor} builderTypes - The processor builder types.
     * @returns {ProcessorBuilderBinding<T>[]} The processor builders.
     * @template T The type of the processor builder.
     */
    abstract getProcessorBuilderBindings<T extends Constructor<any>[]>(...builderTypes: T): readonly ProcessorBuilderBinding<InstanceType<T[number]>>[];
}
