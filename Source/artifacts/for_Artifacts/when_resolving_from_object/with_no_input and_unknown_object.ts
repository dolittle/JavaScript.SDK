// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { describeThis } from '@dolittle/typescript.testing';

import { UnableToResolveKey } from '../../Mappings/UnableToResolveKey';
import no_association from '../given/no_associations';

describeThis(__filename, () => {
    const object = {};
    let result: any;

    try {
        const result = no_association.artifacts.resolveFrom(object);
    } catch (ex) {
        result = ex;
    }

    it('should throw unable to resolve artifact', () => result.should.be.instanceof(UnableToResolveKey));
});
