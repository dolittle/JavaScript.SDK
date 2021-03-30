// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EventType, EventTypeId, Generation } from '@dolittle/sdk.artifacts';
import '../index';

describe('when converting to and from protobuf', () => {
    const eventTypeId = '5e865826-abd5-43b8-b6a2-589be9e9d1f5';
    const generation = 42;
    const eventType = new EventType(EventTypeId.from(eventTypeId), Generation.from(generation));
    const result = eventType.toProtobuf().toSDK();

    it('should have same identifier as original', () => result.id.equals(eventType.id).should.be.true);
    it('should have same generation as original', () => result.generation.equals(eventType.generation).should.be.true);
});
