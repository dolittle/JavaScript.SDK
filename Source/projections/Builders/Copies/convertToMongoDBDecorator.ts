// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Decorators } from '@dolittle/sdk.common';
import { Constructor } from '@dolittle/types';

import { ProjectionProperty } from '../../Copies/ProjectionProperty';
import { Conversion } from '../../Copies/MongoDB/Conversion';
import { MongoDBConversionDecoratedProperty } from './MongoDBConversionDecoratedProperty';

const [decorator, getMetadata] = Decorators.createMetadataDecorator<MongoDBConversionDecoratedProperty[]>('projection-copy-to-mongodb-conversions', 'convertToMongoDB', Decorators.DecoratorTarget.Property);

/**
 * Decorator for specifying conversions to be applied when producing read model copies to MongoDB.
 * @param {Conversion} conversion - The conversion to apply for the decorated property.
 * @returns {Decorators.Decorator} The decorator.
 */
export function convertToMongoDB(conversion: Conversion): Decorators.Decorator {
    return decorator((target, type, propertyKey, _ , mongoDBConversionDecoratedProperties) => {
        const properties = mongoDBConversionDecoratedProperties || [];

        properties.push(new MongoDBConversionDecoratedProperty(
            ProjectionProperty.from(propertyKey as string),
            conversion,
            type));

        return properties;
    });
}

/**
 * Gets the MongoDB conversion decorated projection properties of the specified class.
 * @param {Constructor<any>} type - The class to get the MongoDB conversion decorated projection properties for.
 * @returns {MongoDBConversionDecoratedProperty[]} The MongoDB conversion decorated projection properties.
 */
export function getConvertToMongoDBDecoratedProperties(type: Constructor<any>): MongoDBConversionDecoratedProperty[] {
    return getMetadata(type) || [];
}
