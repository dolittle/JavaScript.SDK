// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { describeThis } from '@dolittle/typescript.testing';

import { a_map_with_one_element, firstKey, firstValue } from '../given/a_map_with_one_element';

describeThis(__filename, () => {
    const map = a_map_with_one_element();

    const results = Array.from(map[Symbol.iterator]());

    it('should not have returned one entry', () => results.length.should.equal(1));
    it('should return the first key value pair', () => results.should.have.deep.members([
        [firstKey, firstValue]
    ]));
});
