// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ArtifactsBuilder } from '../../index';

describe('when building with no associations', () => {
    const builder = new ArtifactsBuilder();
    const result = builder.build();

    it('should return an instance', () => (result !== null || result !== undefined).should.be.true);
});
