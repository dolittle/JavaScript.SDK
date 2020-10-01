// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import no_associations from '../given/no_associations';
import { EventTypeId } from '../../EventTypeId';
import { Generation } from '../../Generation';

describe('when resolving from object and input is event type id as string', () => {
    const eventTypeId = 'ec0111e1-84e4-4d1a-b7f3-a2f6c4427609';
    const result = no_associations.eventTypes.resolveFrom({}, eventTypeId);
    it('should return event type with the identifier', () => result.id.equals(EventTypeId.from(eventTypeId)).should.be.true);
    it('should return event type with first generation', () => result.generation.should.equal(Generation.first));
});
