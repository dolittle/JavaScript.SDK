// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { Identifier } from './Identifier';
import { ProcessorBuilder } from './ProcessorBuilder';

type Binding = {
    identifier: Identifier;
    type?: Constructor<any>;
    processorBuilder?: ProcessorBuilder;
};

type TypeBinding<T> = {
    identifier: T;
    type: Constructor<any>;
};

type ProcessorBuilderBinding<T> = {
    identifier: Identifier;
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
    abstract getTypeBindings<T>(predicate: (identifier: any) => identifier is T): readonly TypeBinding<T>[];

    /**
     * Gets the bindings for specific kinds of processor builders.
     * @param {Constructor} builderTypes - The processor builder types.
     * @returns {ProcessorBuilderBinding<T>[]} The processor builders.
     * @template T The type of the processor builder.
     */
    abstract getProcessorBuilderBindings<T extends Constructor<any>[]>(...builderTypes: T): readonly ProcessorBuilderBinding<InstanceType<T[number]>>[];
}
