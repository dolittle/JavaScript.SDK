// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Failure as PbFailure } from '@dolittle/contracts/Protobuf/Failure_pb';
import '../failures';
import { MissingFailureIdentifier } from '../MissingFailureIdentifier';

describe('when converting from protobuf with missing id', () => {
    const reason = 'MyReason';
    const pbFailure = new PbFailure();
    pbFailure.setReason(reason);

    let result: any;

    try {
        pbFailure.toSDK();
    } catch (ex) {
        result = ex;
    }

    it('should throw missing failure identifier', () => result.should.be.instanceOf(MissingFailureIdentifier));
});
