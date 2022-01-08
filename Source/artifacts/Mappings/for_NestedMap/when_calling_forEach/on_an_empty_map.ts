// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { describeThis } from '@dolittle/typescript.testing';

import { an_empty_map } from '../given/an_empty_map';

describeThis(__filename, () => {
    const map = an_empty_map();

    const args: any[] = [];
    map.forEach((value, key, map) => args.push([value, key, map]));

    it('should not have called the callback', () => args.should.be.empty);
});
