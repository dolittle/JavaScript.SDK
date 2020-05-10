// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ArtifactsBuilder } from '../../ArtifactsBuilder';
import { ArtifactId } from '../../ArtifactId';

class FirstType {}

class SecondType {}

describe('when building with two associations', () => {
    const firstTypeIdentifier = ArtifactId.create();
    const secondTypeIdentifier = ArtifactId.create();
    const firstTypeGeneration = 42;
    const secondTypeGeneration = 43;

    const builder = new ArtifactsBuilder();
    builder.associateType(FirstType, firstTypeIdentifier, firstTypeGeneration);
    builder.associateType(SecondType, secondTypeIdentifier, secondTypeGeneration);
    const result = builder.build();

    const firstTypeAssociation = result.getFor(FirstType);
    const secondTypeAssociation = result.getFor(SecondType);

    it('should return an instance', () => (result !== null || result !== undefined).should.be.true);
    it('should associate identifier for first type', () => firstTypeAssociation.id.should.equal(firstTypeIdentifier));
    it('should associate generation for first type', () => firstTypeAssociation.generation.should.equal(firstTypeGeneration));
    it('should associate identifier for second type', () => secondTypeAssociation.id.should.equal(secondTypeIdentifier));
    it('should associate generation for first type', () => secondTypeAssociation.generation.should.equal(secondTypeGeneration));
});
