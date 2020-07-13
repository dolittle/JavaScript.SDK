// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Claim } from './Claim';

/**
 * Represents a collection of claims.
 *
 * @summary This type implements Iterable<Claim> and can be used for iterations directly.
 */
export class Claims implements Iterable<Claim> {
    private _claims: Array<Claim> = [];

    static readonly empty: Claims = new Claims();

    /**
     * Creates an instance of claims.
     * @param [claims] Claims to initialize with.
     */
    constructor(claims?: Array<Claim>) {
        if (claims) {
            this._claims = claims;
        }
    }

    /** @inheritdoc */
    [Symbol.iterator](): Iterator<any, any, undefined> {
        let position = 0;
        const self = this;
        return {
            next() {
                return {
                    done: position === self._claims.length,
                    value: self._claims[position++]
                };
            }
        };
    }

    /**
     * Convert claims to an array.
     * @returns {Claims[]} Array of claims.
     */
    toArray(): Array<Claim> {
        return [...this._claims];
    }
}
