// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { describeThis } from '@dolittle/typescript.testing';
import * as sinon from 'ts-sinon';

import { IModel } from '@dolittle/sdk.common';

import { EventTypesModelBuilder } from '../../EventTypesModelBuilder';

describeThis(__filename, () => {
    const builder = new EventTypesModelBuilder();
    const model = sinon.stubInterface<IModel>({
        getTypeBindings: [],
    });

    const eventTypes = builder.build(model);

    it('should return an instance', () => (eventTypes !== null || eventTypes !== undefined).should.be.true);
    it('should have no associations', () => eventTypes.getAll().should.be.empty);
});
