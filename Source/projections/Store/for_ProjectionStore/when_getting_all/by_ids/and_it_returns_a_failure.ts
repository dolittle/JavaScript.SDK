// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { describeThis } from '@dolittle/typescript.testing';

import { Cancellation } from '@dolittle/sdk.resilience';

import { Failure } from '@dolittle/contracts/Protobuf/Failure_pb';
import { GetAllResponse } from '@dolittle/runtime.contracts/Projections/Store_pb';

import given from '../../given';
import { ProjectionStore } from '../../../ProjectionStore';

describeThis(__filename, () => {
    const [projections_client, server_stream] = given.projections_client_and_get_all_stream;

    const projection_store = new ProjectionStore(
        projections_client,
        given.an_execution_context,
        given.empty_read_model_types,
        given.a_logger);

    const result = projection_store.getAll('ab3be0d3-e550-4ac0-8646-87f376d3d1b0', '6f428480-4cb6-4454-b52d-dd453f6e8a98', Cancellation.default);
    result.catch();

    const failure = new Failure();
    const response = new GetAllResponse();
    response.setFailure(failure);
    server_stream.emit('data', response);
    server_stream.emit('end');

    it('should throw an exception', () => result.should.eventually.be.rejected);
});
