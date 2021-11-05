// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Claim } from '@dolittle/sdk.execution';
import '../claims';

describe('when converting claim to and from protobuf', () => {
    const claim = new Claim('my-claim','forty two', 'string');
    const result = claim.toProtobuf().toSDK();

    it('should contain same key', () => result.key.should.equal(claim.key));
    it('should contain same value', () => result.value.should.equal(claim.value));
    it('should contain same value type', () => result.valueType.should.equal(claim.valueType));
});
