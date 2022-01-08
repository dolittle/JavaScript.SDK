// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { Binding, IModel, ProcessorBuilderBinding, TypeBinding } from './IModel';
import { AnyIdentifier } from './Identifier';
import { ProcessorBuilder } from './ProcessorBuilder';

/**
 * Represents an implementation of {@link IModel}.
 */
export class Model extends IModel {
    /** @inheritdoc */
    readonly bindings: Binding[] = [];

    /**
     * Initialises a new instance of the {@link Model} class.
     * @param {[AnyIdentifier, Constructor][]} types - The valid type bindings.
     * @param {[AnyIdentifier, ProcessorBuilder][]} processorBuilders - The valid processor builder bindings.
     */
    constructor(
        types: readonly [AnyIdentifier, Constructor<any>][],
        processorBuilders: readonly [AnyIdentifier, ProcessorBuilder][]
    ) {
        super();

        for (const [ identifier, type ] of types) {
            this.bindings.push({ identifier, type });
        }
        binding: for (const [ identifier, processorBuilder ] of processorBuilders) {
            for (const binding of this.bindings) {
                if (binding.identifier.equals(identifier)) {
                    binding.processorBuilder = processorBuilder;
                    continue binding;
                }
            }
            this.bindings.push({ identifier, processorBuilder });
        }
    }

    /** @inheritdoc */
    getTypeBindings<T extends AnyIdentifier>(predicate: (identifier: any) => identifier is T): readonly TypeBinding<T>[] {
        const typeBindings: TypeBinding<T>[] = [];
        for (const { identifier, type } of this.bindings) {
            if (predicate(identifier) && type !== undefined) {
                typeBindings.push({ identifier, type });
            }
        }
        return typeBindings;
    }

    /** @inheritdoc */
    getProcessorBuilderBindings<T extends Constructor<any>[]>(...builderTypes: T): readonly ProcessorBuilderBinding<InstanceType<T[number]>>[] {
        const processorBuilderBindings: ProcessorBuilderBinding<InstanceType<T[number]>>[] = [];
        for (const { identifier, processorBuilder: builder } of this.bindings) {
            if (builder !== undefined && builderTypes.some(type => builder instanceof type)) {
                const processorBuilder = builder as InstanceType<T[number]>;
                processorBuilderBindings.push({ identifier, processorBuilder });
            }
        }
        return processorBuilderBindings;
    }
}
