// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ProjectionProperty } from '../ProjectionProperty';
import { Conversion } from './Conversion';

/**
 * Represents the specification of a conversion for a property in a MongoDB read model copy.
 */
export class PropertyConversion {
    /**
     * Initialises a new instance of the {@link PropertyConversion} class.
     * @param {ProjectionProperty} property - The name of the property.
     * @param {Conversion} convertTo - The conversion to apply.
     * @param {boolean} shouldRename - A value indicating whether or not to rename the property.
     * @param {ProjectionProperty} renameTo - The name to rename the property to.
     * @param {PropertyConversion[]} children - Conversions to apply to child properties of this property.
     */
    constructor(
        readonly property: ProjectionProperty,
        readonly convertTo: Conversion,
        readonly shouldRename: boolean,
        readonly renameTo: ProjectionProperty,
        readonly children: PropertyConversion[],
    ) {}
}
