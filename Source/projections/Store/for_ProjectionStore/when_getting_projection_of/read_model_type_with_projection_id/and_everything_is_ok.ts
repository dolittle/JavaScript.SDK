// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ScopeId } from '@dolittle/sdk.events';
import { describeThis } from '@dolittle/typescript.testing';
import { ProjectionId } from '../../../../ProjectionId';
import { ProjectionStore } from '../../../ProjectionStore';
import { ScopedProjectionId } from '../../../ScopedProjectionId';
import given from '../../given';
import { a_projection_type } from '../../given/a_projection_type';

describeThis(__filename, () => {
    const [projections_client, server_stream] = given.projections_client_and_get_all_stream;

    const projection_store = new ProjectionStore(
        projections_client,
        given.an_execution_context,
        given.empty_read_model_types,
        given.a_logger);

    const result = projection_store.of(a_projection_type, '88ae51ba-91fb-4168-990c-50d153804d42');

    it('should get the projection of the type', () => result.should.not.be.undefined);
    it('should have the correct identifier', () => result.identifier.equals(new ScopedProjectionId(ProjectionId.from('88ae51ba-91fb-4168-990c-50d153804d42'), ScopeId.default)));
});
