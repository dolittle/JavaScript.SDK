// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { expect } from 'chai';
import { describeThis } from '@dolittle/typescript.testing';

import { an_empty_map, firstKey, secondKey, thirdKey, unsetKey } from '../given/an_empty_map';

describeThis(__filename, () => {
    const map = an_empty_map();

    const newValue = {};
    map.set(firstKey, newValue);

    it('should have one element', () => map.size.should.equal(1));
    it('should get new value for the first key', () => expect(map.get(firstKey)).to.equal(newValue));
    it('should get undefined for the second key', () => expect(map.get(secondKey)).to.be.undefined);
    it('should get undefined for the third key', () => expect(map.get(thirdKey)).to.be.undefined);
    it('should get undefined for the unset key', () => expect(map.get(unsetKey)).to.be.undefined);
});
