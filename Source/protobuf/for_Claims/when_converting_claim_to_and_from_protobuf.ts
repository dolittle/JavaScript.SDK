// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { describeThis } from '@dolittle/typescript.testing';

import { Claim } from '@dolittle/sdk.execution';

import { toProtobuf, toSDK } from '../Claims';

describeThis(__filename, () => {
    const claim = new Claim('my-claim','forty two', 'string');
    const result = toSDK(toProtobuf(claim));

    it('should contain same key', () => result.key.should.equal(claim.key));
    it('should contain same value', () => result.value.should.equal(claim.value));
    it('should contain same value type', () => result.valueType.should.equal(claim.valueType));
});
