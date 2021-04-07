// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';
import { map } from 'rxjs/operators';
import { callContexts, failures, guids } from '@dolittle/sdk.protobuf';
import { Cancellation } from '@dolittle/sdk.resilience';
import { reactiveUnary } from '@dolittle/sdk.services';
import { Key } from '..';
import { CurrentState } from './CurrentState';
import { IProjections } from './IProjections';
import { IProjectionAssociations } from './IProjectionAssociations';
import { ProjectionsClient } from '@dolittle/runtime.contracts/Projections/Projections_grpc_pb';
import { GetOneRequest, GetOneResponse, GetAllRequest, GetAllResponse } from '@dolittle/runtime.contracts/Projections/Projections_pb';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { Constructor } from '@dolittle/types';

export class Projections implements IProjections {

    constructor(
        private readonly _projectionsClient: ProjectionsClient,
        private readonly _executionContext: ExecutionContext,
        private readonly _projectionAssociations: IProjectionAssociations,
        private readonly _logger: Logger) {}

    get<TProjection>(type: Constructor<TProjection>, key: Key, cancellation: Cancellation = Cancellation.default): Promise<CurrentState<TProjection>> {
        const projection = this._projectionAssociations.getFor<TProjection>(type);
        const request = new GetOneRequest();
        request.setCallcontext(callContexts.toProtobuf(this._executionContext));
        request.setKey(key.value);
        request.setProjectionid(guids.toProtobuf(projection.identifier.value));
        request.setScopeid(guids.toProtobuf(projection.scopeId.value));
        return reactiveUnary(this._projectionsClient, this._projectionsClient.getOne, request, cancellation)
            .pipe(map(response => {
                //TODO: Convert to something the SDK/User can work with. Create Converter as we have in C# SDK
                const type = response.getState()?.getType();
                const state = response.getState()?.getState();
                return new CurrentState<TProjection>(type, state);
            })).toPromise();
    }

    getAll<TProjection>(type: Constructor<TProjection>, cancellation: Cancellation = Cancellation.default): Promise<CurrentState<TProjection>[]> {
        const projection = this._projectionAssociations.getFor<TProjection>(type);
        const request = new GetAllRequest();
        request.setCallcontext(callContexts.toProtobuf(this._executionContext));
        request.setProjectionid(guids.toProtobuf(projection.identifier.value));
        request.setScopeid(guids.toProtobuf(projection.scopeId.value)));
        return reactiveUnary(this._projectionsClient, this._projectionsClient.getAll, request, cancellation)
            .pipe(map(response => {
                //TODO: Convert to something the SDK/User can work with. Create Converter as we have in C# SDK
            })).toPromise();
    }
}
