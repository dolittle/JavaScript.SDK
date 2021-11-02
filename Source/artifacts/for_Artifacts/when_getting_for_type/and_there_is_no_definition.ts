// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { no_artifact_type_associated_with_type } from '../given/artifacts';
import no_associations from '../given/no_associations';

class MyType { }

describe('when checking if has for type and there is no definition', () => {
    let result: any;
    try {
        no_associations.artifacts.getFor(MyType);
    } catch (exception) {
        result = exception;
    }

    it('should throw unknown artifact', () => result.should.be.instanceof(no_artifact_type_associated_with_type));
});
