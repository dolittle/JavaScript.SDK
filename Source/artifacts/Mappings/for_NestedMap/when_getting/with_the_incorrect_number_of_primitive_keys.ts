// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { expect } from 'chai';
import { describeThis } from '@dolittle/typescript.testing';

import { IncorrectNumberOfPrimitiveKeysProvided } from '../../IncorrectNumberOfPrimitiveKeysProvided';
import { a_map_with_three_elements } from '../given/a_map_with_three_elements';

describeThis(__filename, () => {
    const map = a_map_with_three_elements();

    const has = () => map.get([1, 2] as any);

    it('should not modify the map', () => map.size.should.equal(3));
    it('should throw an exception', () => expect(has).to.throw(IncorrectNumberOfPrimitiveKeysProvided));
});
