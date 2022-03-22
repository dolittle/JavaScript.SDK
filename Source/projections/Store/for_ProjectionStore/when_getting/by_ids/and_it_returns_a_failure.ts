// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { describeThis } from '@dolittle/typescript.testing';
import { Guid } from '@dolittle/rudiments';

import { Cancellation } from '@dolittle/sdk.resilience';
import { Guids } from '@dolittle/sdk.protobuf';

import { Failure } from '@dolittle/contracts/Protobuf/Failure_pb';
import { GetOneResponse } from '@dolittle/contracts/Runtime/Projections/Store_pb';

import given from '../../given';
import { ProjectionStore } from '../../../ProjectionStore';
import { FailedToGetProjection } from '../../../FailedToGetProjection';

describeThis(__filename, () => {
    const failure = new Failure();
    failure.setId(Guids.toProtobuf(Guid.create()));
    const response = new GetOneResponse();
    response.setFailure(failure);

    const projections_client = given.projections_client_with_get_one_response(response);

    const projection_store = new ProjectionStore(
        projections_client,
        given.an_execution_context,
        given.empty_read_model_types,
        given.a_logger);

    const result = projection_store.get('key', 'ab3be0d3-e550-4ac0-8646-87f376d3d1b0', '6f428480-4cb6-4454-b52d-dd453f6e8a98', Cancellation.default);
    result.catch();

    it('should throw an exception', () => result.should.eventually.be.rejectedWith(FailedToGetProjection));
});
