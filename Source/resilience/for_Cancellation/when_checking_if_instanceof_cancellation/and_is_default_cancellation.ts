// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { describeThis } from '@dolittle/typescript.testing';

import { Cancellation } from '../..';

describeThis(__filename, () => {
    const result = Cancellation.default instanceof Cancellation;

    it('should be', () => result.should.be.true);
});
