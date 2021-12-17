// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { describeThis } from '@dolittle/typescript.testing';
import * as sinon from 'ts-sinon';

import { IClientBuildResults } from '@dolittle/sdk.common';
import { Generation } from '@dolittle/sdk.artifacts';

import { EventTypeId } from '../../../EventTypeId';
import { EventTypesBuilder } from '../../EventTypesBuilder';

class FirstType {}

class SecondType {}

describeThis(__filename, () => {
    const firstTypeIdentifier = EventTypeId.from('21ef6f8d-4871-48b0-9567-4d576b6a12da');
    const secondTypeIdentifier = EventTypeId.from('1c385ede-49ce-4266-a752-e1a85587758e');
    const firstTypeGeneration = Generation.from(42);
    const secondTypeGeneration = Generation.from(43);

    const results = sinon.stubInterface<IClientBuildResults>();
    const builder = new EventTypesBuilder(results);

    builder.associate(FirstType, firstTypeIdentifier, firstTypeGeneration);
    builder.associate(SecondType, secondTypeIdentifier, secondTypeGeneration);
    const eventTypes = builder.build();

    const firstTypeAssociation = eventTypes.getFor(FirstType);
    const secondTypeAssociation = eventTypes.getFor(SecondType);

    it('should return an instance', () => (eventTypes !== null || eventTypes !== undefined).should.be.true);
    it('should associate identifier for first type', () => firstTypeAssociation.id.equals(firstTypeIdentifier).should.be.true);
    it('should associate generation for first type', () => firstTypeAssociation.generation.equals(firstTypeGeneration).should.be.true);
    it('should associate identifier for second type', () => secondTypeAssociation.id.equals(secondTypeIdentifier).should.be.true);
    it('should associate generation for first type', () => secondTypeAssociation.generation.equals(secondTypeGeneration).should.be.true);
});
