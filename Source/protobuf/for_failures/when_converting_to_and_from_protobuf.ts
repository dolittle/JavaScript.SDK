// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import '../failures';
import { Guid } from '@dolittle/rudiments';
import { Failure } from '../Failure';
import { notApplicable } from '@dolittle/sdk.execution/Distribution/MicroserviceId';

describe('when converting to and from protobuf', () => {
    const reason = 'MyReason';
    const failure = new Failure(Guid.create(), reason);
    const result = failure.toProtobuf().toSDK();

    it('should not be undefined', () => result!.should.not.be.undefined);
    it('should have same identifier as original', () => result!.id.toString().should.be.equal(failure.id.toString()));
    it('should have same reason as original', () => result!.reason.should.be.equal(failure.reason));
});
