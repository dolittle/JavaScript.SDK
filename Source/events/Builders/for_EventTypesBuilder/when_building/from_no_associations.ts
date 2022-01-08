// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { describeThis } from '@dolittle/typescript.testing';
import * as sinon from 'ts-sinon';

import { IModel } from '@dolittle/sdk.common';

import { EventTypesModelBuilder } from '../../EventTypesModelBuilder';

describeThis(__filename, () => {
    const model = sinon.stubInterface<IModel>({
        getTypeBindings: [],
    });
    const builder = new EventTypesModelBuilder(model);

    const eventTypes = builder.build();

    it('should return an instance', () => (eventTypes !== null || eventTypes !== undefined).should.be.true);
    it('should have no associations', () => eventTypes.getAll().should.be.empty);
});
