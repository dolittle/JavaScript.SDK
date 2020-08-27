// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Failure, FailureId, FailureReason } from '../index';

describe('when converting to and from protobuf', () => {
    const reason = FailureReason.create('MyReason');
    const failure = new Failure(FailureId.create(Guid.create()), reason);
    const result = failure.toProtobuf().toSDK();

    it('should not be undefined', () => result!.should.not.be.undefined);
    it('should have same identifier as original', () => result!.id.equals(failure.id).should.be.true);
    it('should have same reason as original', () => result!.reason.equals(failure.reason).should.be.true);
});
