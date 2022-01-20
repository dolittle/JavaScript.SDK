// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { describeThis } from '@dolittle/typescript.testing';

import { toProtobuf, toSDK } from '../Failures';
import { Failure } from '../Failure';

describeThis(__filename, () => {
    const failureId = '0c2b9956-cbe8-4ed1-be9c-d2ede0c8ec20';
    const reason = 'MyReason';
    const failure = Failure.from(failureId, reason);
    const result = toSDK(toProtobuf(failure));

    it('should not be undefined', () => result!.should.not.be.undefined);
    it('should have same identifier as original', () => result!.id.equals(failure.id).should.be.true);
    it('should have same reason as original', () => result!.reason.equals(failure.reason).should.be.true);
});
