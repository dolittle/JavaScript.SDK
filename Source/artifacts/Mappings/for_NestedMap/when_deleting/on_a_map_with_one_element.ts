// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { expect } from 'chai';
import { describeThis } from '@dolittle/typescript.testing';

import { a_map_with_one_element, firstKey, firstValue } from '../given/a_map_with_one_element';

describeThis(__filename, () => {
    const map = a_map_with_one_element();

    const deleted = map.delete(firstKey);

    it('should have deleted the first key', () => deleted.should.be.true);
    it('should have no elements', () => map.size.should.equal(0));
    it('should not have the first key', () => map.has(firstKey).should.be.false);
    it('should get undefined for the first key', () => expect(map.get(firstKey)).to.be.undefined);
});
