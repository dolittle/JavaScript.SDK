// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import no_association from '../given/no_associations';
import { UnableToResolveArtifact } from '../../UnableToResolveArtifact';

describe('when resolving from object with no input and unknown', () => {
    const object = {};
    let result: any;

    try {
        const result = no_association.artifacts.resolveFrom(object);
    } catch (ex) {
        result = ex;
    }

    it('should throw unable to resolve artifact', () => result.should.be.instanceof(UnableToResolveArtifact));
});
