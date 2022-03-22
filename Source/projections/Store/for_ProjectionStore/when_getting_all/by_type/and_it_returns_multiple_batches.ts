// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { describeThis } from '@dolittle/typescript.testing';

import { Cancellation } from '@dolittle/sdk.resilience';
import { ScopeId } from '@dolittle/sdk.events';

import { GetAllResponse } from '@dolittle/contracts/Runtime/Projections/Store_pb';
import { ProjectionCurrentState } from '@dolittle/contracts/Runtime/Projections/State_pb';

import given from '../../given';
import { ProjectionStore } from '../../../ProjectionStore';
import { a_projection_type } from '../../given/a_projection_type';
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

    const first_state_projection = new a_projection_type();
    const first_state = new ProjectionCurrentState();
    first_state.setKey('first key');
    first_state.setState('{ "aValue": "123" }');

    const second_state = new ProjectionCurrentState();
    second_state.setKey('second key');
    second_state.setState('{ "aValue": "1337" }');

    const third_state = new ProjectionCurrentState();
    third_state.setKey('third key');
    third_state.setState('{ "aValue": "43" }');

    const first_batch = new GetAllResponse();
    first_batch.setStatesList([first_state, second_state]);

    const second_batch = new GetAllResponse();
    second_batch.setStatesList([third_state]);

    server_stream.emit('data', first_batch);
    server_stream.emit('data', second_batch);
    server_stream.emit('end');

    it('should return the correct type', () => result.should.eventually.satisfy((all: any[]) => all.every(read_model => read_model instanceof a_projection_type)));
    it('should return all 3 states', () => result.should.eventually.have.deep.members([
        { aValue: '123' },
        { aValue: '1337' },
        { aValue: '43' },
    ]));
});
