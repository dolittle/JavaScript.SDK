// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { describeThis } from '@dolittle/typescript.testing';

import { Cancellation, CancellationSource } from '../..';

describeThis(__filename, () => {
    const result = new CancellationSource(Cancellation.default).cancellation instanceof Cancellation;

    it('should be', () => result.should.be.true);
});
