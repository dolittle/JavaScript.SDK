// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import no_associations from '../given/no_associations';

class MyType {}

describe('when checking if has for type and there is no definition', () => {
    const result = no_associations.eventTypes.hasFor(MyType);

    it('should not have it', () => result.should.be.false);
});
