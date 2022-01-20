// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { expect } from 'chai';
import { describeThis } from '@dolittle/typescript.testing';

import { a_map_with_three_elements, firstKey, firstValue, secondKey, secondValue, thirdKey, unsetKey } from '../given/a_map_with_three_elements';

describeThis(__filename, () => {
    const map = a_map_with_three_elements();

    const newValue = {};
    map.set(thirdKey, newValue);

    it('should have three elements', () => map.size.should.equal(3));
    it('should get the first value for the first key', () => expect(map.get(firstKey)).to.equal(firstValue));
    it('should get the second value for the second key', () => expect(map.get(secondKey)).to.equal(secondValue));
    it('should get the value for the third key', () => expect(map.get(thirdKey)).to.equal(newValue));
    it('should get undefined for the unset key', () => expect(map.get(unsetKey)).to.be.undefined);
});
