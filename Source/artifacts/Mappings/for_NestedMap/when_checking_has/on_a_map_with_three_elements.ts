// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { describeThis } from '@dolittle/typescript.testing';

import { a_map_with_three_elements, firstKey, secondKey, thirdKey, unsetKey } from '../given/a_map_with_three_elements';

describeThis(__filename, () => {
    const map = a_map_with_three_elements();

    it('should have the first key', () => map.has(firstKey).should.be.true);
    it('should have the second key', () => map.has(secondKey).should.be.true);
    it('should have the third key', () => map.has(thirdKey).should.be.true);
    it('should not have the unset key', () => map.has(unsetKey).should.be.false);
});
