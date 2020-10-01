// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import one_association from '../given/one_association';

describe('when checking if has for type and there is a definition', () => {
    const result = one_association.eventTypes.getFor(one_association.type);

    it('should return an instance', () => (result !== null || result !== undefined).should.be.true);
});
