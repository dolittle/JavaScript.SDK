// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { describeThis } from '@dolittle/typescript.testing';

import { Failure as PbFailure } from '@dolittle/contracts/Protobuf/Failure_pb';

import { toSDK } from '../Failures';
import { MissingFailureIdentifier } from '../MissingFailureIdentifier';

describeThis(__filename, () => {
    const reason = 'MyReason';
    const pbFailure = new PbFailure();
    pbFailure.setReason(reason);

    let result: any;

    try {
        toSDK(pbFailure);
    } catch (ex) {
        result = ex;
    }

    it('should throw missing failure identifier', () => result.should.be.instanceOf(MissingFailureIdentifier));
});
