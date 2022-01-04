// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { describeThis } from '@dolittle/typescript.testing';
import * as sinon from 'ts-sinon';

import { IModel } from '@dolittle/sdk.common';

import { EventTypesModelBuilder } from '../../EventTypesModelBuilder';
import { EventType } from '../../../EventType';

class FirstType {}

class SecondType {}

describeThis(__filename, () => {
    const firstEventType = EventType.from('21ef6f8d-4871-48b0-9567-4d576b6a12da', 42);
    const secondEventType = EventType.from('1c385ede-49ce-4266-a752-e1a85587758e', 43);

    const model = sinon.stubInterface<IModel>({
        getTypeBindings: [
            { identifier: firstEventType, type: FirstType },
            { identifier: secondEventType, type: SecondType },
        ]
    });
    const builder = new EventTypesModelBuilder(model);

    const eventTypes = builder.build();

    it('should return an instance', () => (eventTypes !== null || eventTypes !== undefined).should.be.true);
    it('should have two associations', () => eventTypes.getAll().should.be.of.length(2));

    it('should have an association for the first type', () => eventTypes.hasFor(FirstType).should.be.true);
    it('should have associated the first type with the correct event type', () => eventTypes.getFor(FirstType).equals(firstEventType).should.be.true);
    it('should have an association for the first event type', () => eventTypes.hasTypeFor(firstEventType).should.be.true);
    it('should have associated the first event type with the correct type', () => eventTypes.getTypeFor(firstEventType).should.equal(FirstType));

    it('should have an association for the second type', () => eventTypes.hasFor(SecondType).should.be.true);
    it('should have associated the second type with the correct event type', () => eventTypes.getFor(SecondType).equals(secondEventType).should.be.true);
    it('should have an association for the second event type', () => eventTypes.hasTypeFor(secondEventType).should.be.true);
    it('should have associated the second event type with the correct type', () => eventTypes.getTypeFor(secondEventType).should.equal(SecondType));
});
