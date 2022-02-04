// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';
import { ProjectionProperty } from '../../Copies/ProjectionProperty';
import { Conversion } from '../../Copies/MongoDB/Conversion';

/**
 * Represents a projection property decorated with a 'covertToMongoDB' decorator.
 */
export class MongoDBConversionDecoratedProperty {
    /**
     * Initialises a new instance of the {@link MongoDBConversionDecoratedProperty} class.
     * @param {ProjectionProperty} property - The projection property to be converted.
     * @param {Conversion} conversion - The conversion to apply.
     * @param {Constructor<any>} type - The decorated type.
     */
    constructor(
        readonly property: ProjectionProperty,
        readonly conversion: Conversion,
        readonly type: Constructor<any>
    ) { }
}
