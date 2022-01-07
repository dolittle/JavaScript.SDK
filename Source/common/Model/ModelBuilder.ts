// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { IClientBuildResults } from '../ClientSetup/IClientBuildResults';

import { AnyIdentifier } from './Identifier';
import { IModel } from './IModel';
import { IModelBuilder } from './IModelBuilder';
import { ProcessorBuilder } from './ProcessorBuilder';

/**
 * Represents an implementation of {@link IModelBuilder}.
 */
export class ModelBuilder extends IModelBuilder {
    /** @inheritdoc */
    bindIdentifierToType(identifier: AnyIdentifier, type: Constructor<any>): void {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    unbindIdentifierFromType(identifier: AnyIdentifier, type: Constructor<any>): void {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    bindIdentifierToProcessorBuilder(identifier: AnyIdentifier, processorBuilder: ProcessorBuilder): void {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    unbindIdentifierFromProcessorBuilder(identifier: AnyIdentifier, processorBuilder: ProcessorBuilder): void {
        throw new Error('Method not implemented.');
    }

    /** @inheritdoc */
    build(buildResults: IClientBuildResults): IModel {
        throw new Error('Method not implemented.');
    }
}
