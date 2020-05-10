// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Claim } from './Claim';

export class Claims implements Iterable<Claim> {
    private _claims: Claim[] = [];

    static readonly empty: Claims = new Claims();

    constructor(claims?: Claim[]) {
        if (claims) {
            this._claims = claims;
        }
    }

    [Symbol.iterator](): Iterator<any, any, undefined> {
        let position = 0;
        const self = this;
        return {
            next: function () {
                return {
                    done: position === self._claims.length,
                    value: self._claims[position++]
                };
            }.bind(this)
        };
    }
}
