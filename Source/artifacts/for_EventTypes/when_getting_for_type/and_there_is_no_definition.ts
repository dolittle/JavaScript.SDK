// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import no_associations from '../given/no_associations';
import { UnknownEventType } from '../../UnknownEventType';

class MyType { }

describe('when checking if has for type and there is no definition', () => {
    let result: any;
    try {
        no_associations.eventTypes.getFor(MyType);
    } catch (exception) {
        result = exception;
    }

    it('should throw unknown artifact', () => result.should.be.instanceof(UnknownEventType));
});
