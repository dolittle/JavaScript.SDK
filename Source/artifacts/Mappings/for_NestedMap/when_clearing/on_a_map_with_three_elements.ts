// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { expect } from 'chai';
import { describeThis } from '@dolittle/typescript.testing';

import { a_map_with_three_elements, firstKey, secondKey, thirdKey, unsetKey } from '../given/a_map_with_three_elements';

describeThis(__filename, () => {
    const map = a_map_with_three_elements();

    map.clear();

    it('should have zero elements', () => map.size.should.equal(0));
    it('should get undefined for the first key', () => expect(map.get(firstKey)).to.be.undefined);
    it('should get undefined for the second key', () => expect(map.get(secondKey)).to.be.undefined);
    it('should get undefined for the third key', () => expect(map.get(thirdKey)).to.be.undefined);
    it('should get undefined for the unset key', () => expect(map.get(unsetKey)).to.be.undefined);
});
