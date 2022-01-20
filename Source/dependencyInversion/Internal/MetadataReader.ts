// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Container, interfaces, METADATA_KEY } from 'inversify';
import { MetadataReader as InversifyMetadataReader } from 'inversify/lib/planning/metadata_reader';
import { getServiceInjectionDescriptors } from '../injectDecorator';

/**
 * Represents an extension of the InversifyJS metadata reader that works without the 'reflect-metadata' package.
 */
export class MetadataReader extends InversifyMetadataReader {
    /** @inheritdoc */
    getConstructorMetadata(constructorFunc: NewableFunction): interfaces.ConstructorMetadata {
        const { userGeneratedMetadata } = super.getConstructorMetadata(constructorFunc);
        for (const descriptor of getServiceInjectionDescriptors(constructorFunc)) {
            userGeneratedMetadata[descriptor.index.toString()] = [{
                key: descriptor.multiple ? METADATA_KEY.MULTI_INJECT_TAG : METADATA_KEY.INJECT_TAG,
                value: descriptor.service,
            }];
        }

        return { compilerGeneratedMetadata: [], userGeneratedMetadata };
    }
}
