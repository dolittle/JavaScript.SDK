// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/**
 * Represents MongoDB read model field conversions.
 */
export enum Conversion {
    /**
     * Converts the field into a BSON DateTime.
     */
    DateTime = 1,

    /**
     * Converts the field into a BSON Timestamp.
     */
    Timestamp = 2,

    /**
     * Converts the field into a BSON Binary.
     */
    Binary = 3,
}
