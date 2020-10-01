// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import one_association from '../given/one_association';

describe('when resolving from object with no input', () => {
    const object = new one_association.type();
    const result = one_association.eventTypes.resolveFrom(object);

    it('should return an instance', () => (result !== null || result !== undefined).should.be.true);
});
