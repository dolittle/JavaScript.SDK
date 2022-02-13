// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { describeThis } from '@dolittle/typescript.testing';
import { stubInterface } from 'ts-sinon';

import { IEventTypes, ScopeId } from '@dolittle/sdk.events';
import { IClientBuildResults } from '@dolittle/sdk.common';

import { ProjectionId } from '../../../../ProjectionId';
import { on } from '../../../onDecorator';
import { ProjectionDecoratedType } from '../../../ProjectionDecoratedType';
import { ProjectionClassBuilder } from '../../../ProjectionClassBuilder';
import { ProjectionAlias } from '../../../../ProjectionAlias';

class Projection {
    @on('32e2aaca-2374-42f0-bcb5-7fb19501e3da', _ => _.keyFromEventSource())
    on() {}
}

describeThis(__filename, () => {
    const decoratedType = new ProjectionDecoratedType(
        ProjectionId.from('53cad890-5b8a-4146-acce-29dc2dc8c43e'),
        ScopeId.from('28f6c232-cc11-493b-b032-398a5e651617'),
        ProjectionAlias.from('alias'),
        Projection);

    const builder = new ProjectionClassBuilder(decoratedType);

    const event_types = stubInterface<IEventTypes>();
    const build_results = stubInterface<IClientBuildResults>();

    const result = builder.build(event_types, build_results);

    it('should return a projection', () => result!.should.not.be.undefined);
    it('should not set copy to MongoDB', () => result?.copies.mongoDB.shouldCopyToMongoDB.should.be.false);
});
