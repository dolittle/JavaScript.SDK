// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import one_association from '../given/one_association';

import { describeThis } from '@dolittle/typescript.testing';

describeThis(__filename, () => {
    const result = one_association.artifacts.getFor(one_association.class_type);

    it('should return an instance', () => (result !== null || result !== undefined).should.be.true);
});
