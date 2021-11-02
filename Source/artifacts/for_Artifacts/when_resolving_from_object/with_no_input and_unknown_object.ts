// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { unable_to_resolve_artifact } from '../given/artifacts';
import no_association from '../given/no_associations';

describe('when resolving from object with no input and unknown', () => {
    const object = {};
    let result: any;

    try {
        const result = no_association.artifacts.resolveFrom(object);
    } catch (ex) {
        result = ex;
    }

    it('should throw unable to resolve artifact', () => result.should.be.instanceof(unable_to_resolve_artifact));
});
