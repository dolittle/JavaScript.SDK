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
     * Converts the field into a BSON Array with .NET ticks and offset in minutes as elements.
     */
    DateAsArray = 2,

    /**
     * Converts the field into a BSON Document with Date, .NET ticks and offset in minutes as properties.
     */
    DateAsDocument = 3,

    /**
     * Converts the field into a BSON String formatted like JavaScript Date.toString().
     */
    DateAsString = 4,

    /**
     * Converts the field into a BSON Int64 with .NET ticks as value.
     */
    DateAsInt64 = 5,

    /**
     * Converts the field into a BSON Binary with standard Guid representation.
     */
    Guid = 6,

    /**
     * Converts the field into a BSON Binary with C# legacy Guid representation.
     */
    GuidAsCSharpLegacy = 7,

    /**
     * Converts the field into a BSON String from a parsed Guid.
     */
    GuidAsString = 8,
}
