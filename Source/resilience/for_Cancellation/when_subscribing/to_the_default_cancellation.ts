// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { describeThis } from '@dolittle/typescript.testing';

import { Cancellation } from '../..';

describeThis(__filename, () => {
    Cancellation.default.subscribe(() => {});

    it('should not fail', () => true.should.be.true);
});
