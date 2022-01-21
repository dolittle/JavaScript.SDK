// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { describeThis } from '@dolittle/typescript.testing';

import { Cancellation } from '@dolittle/sdk.resilience';

import { GetAllResponse } from '@dolittle/runtime.contracts/Projections/Store_pb';
import { ProjectionCurrentState } from '@dolittle/runtime.contracts/Projections/State_pb';

import given from '../../given';
import { ProjectionStore } from '../../../ProjectionStore';
import { ReceivedDuplicateProjectionKeys } from '../../../ReceivedDuplicateProjectionKeys';

describeThis(__filename, () => {
    const [projections_client, server_stream] = given.projections_client_and_get_all_stream;

    const projection_store = new ProjectionStore(
        projections_client,
        given.an_execution_context,
        given.empty_read_model_types,
        given.a_logger);

    const result = projection_store.getAll('ab3be0d3-e550-4ac0-8646-87f376d3d1b0', '6f428480-4cb6-4454-b52d-dd453f6e8a98', Cancellation.default);
    result.catch();

    const first_state = new ProjectionCurrentState();
    first_state.setKey('first key');
    first_state.setState('{ "first": "state" }');

    const second_state = new ProjectionCurrentState();
    second_state.setKey('first key');
    second_state.setState('{ "second": "state" }');

    const first_batch = new GetAllResponse();
    first_batch.setStatesList([first_state, second_state]);

    server_stream.emit('data', first_batch);
    server_stream.emit('end');

    it('should throw an exception', () => result.should.eventually.be.rejectedWith(ReceivedDuplicateProjectionKeys));
});
