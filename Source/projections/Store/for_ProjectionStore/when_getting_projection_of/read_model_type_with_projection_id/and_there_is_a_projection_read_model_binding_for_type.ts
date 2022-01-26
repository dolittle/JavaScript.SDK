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

    const read_model_types = given.empty_read_model_types;
    read_model_types.associate(a_projection_type, new ScopedProjectionId(ProjectionId.from('8f7183cc-2819-40b5-ac1f-c4d877ff9b4e'), ScopeId.default));

    const projection_store = new ProjectionStore(
        projections_client,
        given.an_execution_context,
        read_model_types,
        given.a_logger);

    const result = projection_store.of(a_projection_type, '268ac4a4-a6f0-4a3c-90b0-4adf37dacdf3');

    it('should get the projection of the type', () => result.should.not.be.undefined);
    it('should have the correct identifier', () => result.identifier.equals(new ScopedProjectionId(ProjectionId.from('268ac4a4-a6f0-4a3c-90b0-4adf37dacdf3'), ScopeId.default)));
});
