// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import no_associations from '../given/no_associations';

class MyType {}

import { describeThis } from '@dolittle/typescript.testing';

describeThis(__filename, () => {
    const result = no_associations.artifacts.hasFor(MyType);

    it('should not have it', () => result.should.be.false);
});
