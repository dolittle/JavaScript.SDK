// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

export class Claim {
    readonly key: string;
    readonly value: string;
    readonly valueType: string;

    constructor(key: string, value: string, valueType: string) {
        this.key = key;
        this.value = value;
        this.valueType = valueType;
    }
}
