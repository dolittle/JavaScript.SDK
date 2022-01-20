// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { describeThis } from '@dolittle/typescript.testing';

import { TypeNotAssociatedWithKey } from '../../Mappings/TypeNotAssociatedWithKey';
import no_associations from '../given/no_associations';

class MyType { }

describeThis(__filename, () => {
    let result: any;
    try {
        no_associations.artifacts.getFor(MyType);
    } catch (exception) {
        result = exception;
    }

    it('should throw unknown artifact', () => result.should.be.instanceof(TypeNotAssociatedWithKey));
});
