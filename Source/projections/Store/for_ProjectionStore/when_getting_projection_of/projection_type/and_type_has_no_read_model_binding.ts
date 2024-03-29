// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { describeThis } from '@dolittle/typescript.testing';

import { TypeNotAssociatedWithKey } from '@dolittle/sdk.artifacts';

import given from '../../given';
import { a_projection_type } from '../../given/a_projection_type';
import { ProjectionStore } from '../../../ProjectionStore';

describeThis(__filename, () => {
    let result: any;
    const [projections_client, server_stream] = given.projections_client_and_get_all_stream;

    const projection_store = new ProjectionStore(
        projections_client,
        given.an_execution_context,
        given.empty_read_model_types,
        given.a_logger);

    try {
        projection_store.of(a_projection_type);
    } catch (error) {
        result = error;
    }

    it('should fail because no projection is associated with the type', () => result.should.be.instanceof(TypeNotAssociatedWithKey));
});
