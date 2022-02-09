// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { describeThis } from '@dolittle/typescript.testing';
import { stubInterface } from 'ts-sinon';

import { IEventTypes, ScopeId } from '@dolittle/sdk.events';
import { IClientBuildResults, IModelBuilder } from '@dolittle/sdk.common';

import { ProjectionId } from '../../../../ProjectionId';
import { ProjectionBuilder } from '../../../ProjectionBuilder';
import { ProjectionBuilderForReadModel } from '../../../ProjectionBuilderForReadModel';

class Projection {}

describeThis(__filename, () => {

    const model_builder = stubInterface<IModelBuilder>();
    const parent_builder = stubInterface<ProjectionBuilder>();

    const builder = new ProjectionBuilderForReadModel(
        ProjectionId.from('2640b8db-0391-4f99-ae3c-093ed191b00a'),
        Projection,
        ScopeId.from('87655996-d359-483e-a075-c7d833c4e572'),
        model_builder,
        parent_builder);

    builder.on('cf566852-1a29-4f96-ba54-568c88e4a0e6', _ => _.keyFromEventSource(), _ => _);

    builder.copyToMongoDB(_ => _
        .toCollection('collection-name')
    );

    const event_types = stubInterface<IEventTypes>();
    const build_results = stubInterface<IClientBuildResults>();

    const result = builder.build(event_types, build_results);

    it('should return a projection', () => result!.should.not.be.undefined);
    it('should set copy to MongoDB', () => result?.copies.mongoDB.shouldCopyToMongoDB.should.be.true);
    it('should copy to a collection with the given name', () => result?.copies.mongoDB.collectionName.value.should.equal('collection-name'));
    it('should not have any conversions', () => result?.copies.mongoDB.conversions.should.be.empty);
});
