// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { describeThis } from '@dolittle/typescript.testing';

import { an_empty_map, firstKey } from '../given/an_empty_map';

describeThis(__filename, () => {
    const map = an_empty_map();

    const deleted = map.delete(firstKey);

    it('should not have deleted the first key', () => deleted.should.be.false);
    it('should have no elements', () => map.size.should.equal(0));
});
