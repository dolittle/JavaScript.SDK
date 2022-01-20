// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { describeThis } from '@dolittle/typescript.testing';

import { a_map_with_one_element, firstKey, secondKey, thirdKey, unsetKey } from '../given/a_map_with_one_element';

describeThis(__filename, () => {
    const map = a_map_with_one_element();

    it('should have the first key', () => map.has(firstKey).should.be.true);
    it('should not have the second key', () => map.has(secondKey).should.be.false);
    it('should not have the third key', () => map.has(thirdKey).should.be.false);
    it('should not have the unset key', () => map.has(unsetKey).should.be.false);
});
