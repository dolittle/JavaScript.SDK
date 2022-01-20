// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { describeThis } from '@dolittle/typescript.testing';

import { a_map_with_three_elements, firstKey, secondKey, thirdKey } from '../given/a_map_with_three_elements';

describeThis(__filename, () => {
    const map = a_map_with_three_elements();

    const results = Array.from(map.keys());

    it('should not have returned three entries', () => results.length.should.equal(3));
    it('should return all keys', () => results.should.have.deep.members([firstKey, secondKey, thirdKey]));
});
