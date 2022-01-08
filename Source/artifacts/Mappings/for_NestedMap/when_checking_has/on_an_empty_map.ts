// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { describeThis } from '@dolittle/typescript.testing';

import { an_empty_map, firstKey, secondKey, thirdKey, unsetKey } from '../given/an_empty_map';

describeThis(__filename, () => {
    const map = an_empty_map();

    it('should not have the first key', () => map.has(firstKey).should.be.false);
    it('should not have the second key', () => map.has(secondKey).should.be.false);
    it('should not have the third key', () => map.has(thirdKey).should.be.false);
    it('should not have the unset key', () => map.has(unsetKey).should.be.false);
});
