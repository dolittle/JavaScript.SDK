// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EventTypes } from '../../../EventTypes';
import { EventTypesBuilder } from '../../EventTypesBuilder';

import { describeThis } from '@dolittle/typescript.testing';

describeThis(__filename, () => {
    const builder = new EventTypesBuilder();
    const eventTypes = new EventTypes();

    builder.addAssociationsInto(eventTypes);

    it('should return an instance', () => (eventTypes !== null || eventTypes !== undefined).should.be.true);
});
