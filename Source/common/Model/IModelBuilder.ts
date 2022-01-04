// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { IClientBuildResults } from '../ClientSetup/IClientBuildResults';
import { Identifier } from './Identifier';
import { IModel } from './IModel';
import { ProcessorBuilder } from './ProcessorBuilder';

/**
 * Defines a builder for building a Dolittle application model.
 */
export abstract class IModelBuilder {
    /**
     * Adds a binding between an identifier and a type.
     * @param {Identifier} identifier - The identifier to bind.
     * @param {Constructor} type - The type to bind the identifier to.
     */
    abstract bindIdentifierToType(identifier: Identifier, type: Constructor): void;

    /**
     * Adds a binding between an identifier and a processor builder.
     * @param {Identifier} identifier - The identifier to bind.
     * @param {ProcessorBuilder} processorBuilder - The processor builder to bind the identifier to.
     */
    abstract bindIdentifierToProcessorBuilder(identifier: Identifier, processorBuilder: ProcessorBuilder): void;

    /**
     * Builds a valid Dolittle application model from the bindings.
     * @param {IClientBuildResults} buildResults - For keeping track of build results.
     */
    abstract build(buildResults: IClientBuildResults): IModel;
}
