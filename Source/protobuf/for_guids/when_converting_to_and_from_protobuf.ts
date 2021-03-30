// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { guids } from '..';

describe('when converting to and from protobuf', () => {
    const guid = Guid.create();
    const uuid = guids.toProtobuf(guid);
    const result = guids.toSDK(uuid);

    it('should be the same', () => result.toString().should.equal(guid.toString()));
});
