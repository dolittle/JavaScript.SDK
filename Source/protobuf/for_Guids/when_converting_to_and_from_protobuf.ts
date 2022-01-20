// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { describeThis } from '@dolittle/typescript.testing';

import * as Guids from '../Guids';

describeThis(__filename, () => {
    const guid = Guid.create();
    const uuid = Guids.toProtobuf(guid);
    const result = Guids.toSDK(uuid);

    it('should be the same', () => result.toString().should.equal(guid.toString()));
});
