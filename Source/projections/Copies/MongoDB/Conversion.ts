// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/**
 * Represents MongoDB read model field conversions.
 */
export enum Conversion {
    /**
     * Applies no conversion.
     */
    None = 0,

    /**
     * Converts the field into a BSON Date.
     */
    Date = 1,

    /**
     * Converts the field into a BSON Binary Guid.
     */
    Guid = 2,
}
