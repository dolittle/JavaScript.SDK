// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { describeThis } from '@dolittle/typescript.testing';
import * as sinon from 'ts-sinon';

import { IClientBuildResults } from '@dolittle/sdk.common';

import { EventTypesBuilder } from '../../EventTypesBuilder';

describeThis(__filename, () => {
    const results = sinon.stubInterface<IClientBuildResults>();
    const builder = new EventTypesBuilder(results);

    const eventTypes = builder.build();

    it('should return an instance', () => (eventTypes !== null || eventTypes !== undefined).should.be.true);
});
