// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import one_association from '../given/one_association';

import { describeThis } from '@dolittle/typescript.testing';

describeThis(__filename, () => {
    const object = new one_association.class_type();
    const result = one_association.artifacts.resolveFrom(object);

    it('should return an instance', () => (result !== null || result !== undefined).should.be.true);
});
