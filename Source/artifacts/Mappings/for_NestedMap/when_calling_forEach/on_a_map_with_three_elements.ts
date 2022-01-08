// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { describeThis } from '@dolittle/typescript.testing';

import { a_map_with_three_elements, firstKey, firstValue, secondKey, secondValue, thirdKey, thirdValue } from '../given/a_map_with_three_elements';

describeThis(__filename, () => {
    const map = a_map_with_three_elements();

    const args: any[] = [];
    map.forEach((value, key, map) => args.push([value, key, map]));

    it('should have called the callback three times', () => args.length.should.equal(3));
    it('should provide the correct callback arguments', () => args.should.have.deep.members([
        [firstValue, firstKey, map],
        [secondValue, secondKey, map],
        [thirdValue, thirdKey, map],
    ]));
});
