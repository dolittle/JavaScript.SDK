// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { describeThis } from '@dolittle/typescript.testing';

import { ScopeId } from '@dolittle/sdk.events';

import given from '../../../given';
import { a_projection_type } from '../../../given/a_projection_type';
import { ProjectionId } from '../../../../../ProjectionId';
import { ProjectionStore } from '../../../../ProjectionStore';

describeThis(__filename, () => {
    const [projections_client, server_stream] = given.projections_client_and_get_all_stream;

    const projection_store = new ProjectionStore(
        projections_client,
        given.an_execution_context,
        given.empty_read_model_types,
        given.a_logger);

    const result = projection_store.of(a_projection_type, '88ae51ba-91fb-4168-990c-50d153804d42', '01f18113-25e6-4912-8572-7f17a291d6a5');

    it('should get the projection of the type', () => result.should.not.be.undefined);
    it('should have the provided identifier', () => result.identifier.equals(ProjectionId.from('88ae51ba-91fb-4168-990c-50d153804d42')));
    it('should have the provided scope', () => result.scope.equals(ScopeId.from('01f18113-25e6-4912-8572-7f17a291d6a5')));
});
