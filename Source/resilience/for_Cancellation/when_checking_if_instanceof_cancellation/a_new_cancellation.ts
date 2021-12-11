// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Subject } from 'rxjs';
import { describeThis } from '@dolittle/typescript.testing';

import { Cancellation } from '../../Cancellation';

describeThis(__filename, () => {
    const result = new Cancellation(new Subject()) instanceof Cancellation;

    it('should be', () => result.should.be.true);
});
