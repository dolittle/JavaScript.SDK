// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/**
 * Represents a claim.
 */
export class Claim {
    readonly key: string;
    readonly value: string;
    readonly valueType: string;

    /**
     * Creates an instance of claim.
     * @param {string} key - Key of the claim.
     * @param {string} value - Value on the claim.
     * @param {string} valueType - Type of value.
     */
    constructor(key: string, value: string, valueType: string) {
        this.key = key;
        this.value = value;
        this.valueType = valueType;
    }
}
