// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { IClientBuildResults } from '../ClientSetup/IClientBuildResults';

import { Identifier } from './Identifier';
import { IModel } from './IModel';
import { IModelBuilder } from './IModelBuilder';
import { ProcessorBuilder } from './ProcessorBuilder';

/**
 * Represents an implementation of {@link IModelBuilder}.
 */
export class ModelBuilder extends IModelBuilder {
    /** @inheritdoc */
    bindIdentifierToType(identifier: Identifier, type: Constructor<{}>): void {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    bindIdentifierToProcessorBuilder(identifier: Identifier, processorBuilder: ProcessorBuilder): void {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    build(buildResults: IClientBuildResults): IModel {
        throw new Error('Method not implemented.');
    }
}
