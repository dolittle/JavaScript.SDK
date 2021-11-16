// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Claim } from './Claim';

/**
 * Represents a collection of claims.
 *
 * @summary This type implements {@link Iterable<Claim>} and can be used for iterations directly.
 */
export class Claims implements Iterable<Claim> {
    private _claims: Claim[] = [];

    static readonly empty: Claims = new Claims();

    /**
     * Creates an instance of claims.
     * @param {Claim[]} [claims] - Claims to initialize with.
     */
    constructor(claims?: Claim[]) {
        if (claims) {
            this._claims = claims;
        }
    }

    /** @inheritdoc */
    [Symbol.iterator](): Iterator<Claim>{
        return this._claims[Symbol.iterator]();
    }

    /**
     * Convert claims to an array.
     * @returns {Claims[]} Array of claims.
     */
    toArray(): Claim[] {
        return [...this._claims];
    }
}
