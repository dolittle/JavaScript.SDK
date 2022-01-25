// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { describeThis } from '@dolittle/typescript.testing';

import { Cancellation } from '@dolittle/sdk.resilience';
import { ScopeId } from '@dolittle/sdk.events';

import { Failure } from '@dolittle/contracts/Protobuf/Failure_pb';
import { GetAllResponse } from '@dolittle/runtime.contracts/Projections/Store_pb';

import given from '../../given';
import { a_projection_type } from '../../given/a_projection_type';
import { ProjectionStore } from '../../../ProjectionStore';
import { ScopedProjectionId } from '../../../ScopedProjectionId';
import { ProjectionId } from '../../../../ProjectionId';

describeThis(__filename, () => {
    const [projections_client, server_stream] = given.projections_client_and_get_all_stream;

    const read_model_types = given.empty_read_model_types;
    read_model_types.associate(a_projection_type, new ScopedProjectionId(ProjectionId.from('3f1688f2-1e21-4a2e-bb19-c3c88aecb0b'), ScopeId.default));

    const projection_store = new ProjectionStore(
        projections_client,
        given.an_execution_context,
        read_model_types,
        given.a_logger);

    const result = projection_store.getAll(a_projection_type, Cancellation.default);
    result.catch();

    const failure = new Failure();
    const response = new GetAllResponse();
    response.setFailure(failure);
    server_stream.emit('data', response);
    server_stream.emit('end');

    it('should throw an exception', () => result.should.eventually.be.rejected);
});
