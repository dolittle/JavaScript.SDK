// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Failure } from '../Failure';
import '../failures';

import { describeThis } from '@dolittle/typescript.testing';

describeThis(__filename, () => {
    const failureId = '0c2b9956-cbe8-4ed1-be9c-d2ede0c8ec20';
    const reason = 'MyReason';
    const failure = Failure.from(failureId, reason);
    const result = failure.toProtobuf().toSDK();

    it('should not be undefined', () => result!.should.not.be.undefined);
    it('should have same identifier as original', () => result!.id.equals(failure.id).should.be.true);
    it('should have same reason as original', () => result!.reason.equals(failure.reason).should.be.true);
});
