// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { describeThis } from '@dolittle/typescript.testing';
import * as sinon from 'ts-sinon';

import { IClientBuildResults } from '@dolittle/sdk.common';

import { EventTypesBuilder } from '../../EventTypesBuilder';

describeThis(__filename, () => {
    const builder = new EventTypesBuilder();
    const results = sinon.stubInterface<IClientBuildResults>();

    const eventTypes = builder.build(results);

    it('should return an instance', () => (eventTypes !== null || eventTypes !== undefined).should.be.true);
});
