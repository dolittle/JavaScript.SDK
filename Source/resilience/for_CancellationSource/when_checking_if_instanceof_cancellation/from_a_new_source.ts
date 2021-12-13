// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { describeThis } from '@dolittle/typescript.testing';

import { Cancellation } from '../../Cancellation';
import { CancellationSource } from '../../CancellationSource';

describeThis(__filename, () => {
    const result = new CancellationSource().cancellation instanceof Cancellation;

    it('should be', () => result.should.be.true);
});
