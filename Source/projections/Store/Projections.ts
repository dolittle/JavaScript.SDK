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
import { FailedToGetProjection } from './FailedToGetProjection';
import { ProjectionsToSDKConverter } from './Converters/ProjectionsToSDKConverter';
import { IConvertProjectionsToSDK } from './Converters/IConvertProjectionsToSDK';
import { FailedToGetProjectionState } from './FailedToGetProjectionState';
import { ProjectionAssociation } from './ProjectionAssociation';

export class Projections implements IProjections {

    private _converter: IConvertProjectionsToSDK = new ProjectionsToSDKConverter();

    constructor(
        private readonly _projectionsClient: ProjectionsClient,
        private readonly _executionContext: ExecutionContext,
        private readonly _projectionAssociations: IProjectionAssociations,
        private readonly _logger: Logger) {}

    get<TProjection>(type: Constructor<TProjection>, keyOrString: Key | string, cancellation: Cancellation = Cancellation.default): Promise<CurrentState<TProjection>> {
        const key = typeof keyOrString === 'string'
            ? Key.from(keyOrString)
            : keyOrString;
        const projection = this._projectionAssociations.getFor<TProjection>(type);
        this._logger.debug(`Getting a projection of type ${type} from projection ${projection.identifier} in scope ${projection.scopeId} with key ${key}`);
        const request = new GetOneRequest();
        request.setCallcontext(callContexts.toProtobuf(this._executionContext));
        request.setKey(key.value);
        request.setProjectionid(guids.toProtobuf(projection.identifier.value));
        request.setScopeid(guids.toProtobuf(projection.scopeId.value));
        return reactiveUnary(this._projectionsClient, this._projectionsClient.getOne, request, cancellation)
            .pipe(map(response => {
                this.throwIfHasFailure(response, projection, key);
                this.throwIfNoState(response, projection, key);
                return this._converter.convert<TProjection>(response.getState()!);
            })).toPromise();
    }

    getAll<TProjection>(type: Constructor<TProjection>, cancellation: Cancellation = Cancellation.default): Promise<CurrentState<TProjection>[]> {
        const projection = this._projectionAssociations.getFor<TProjection>(type);
        this._logger.debug(`Getting all projections of type ${type} from projection ${projection.identifier} in scope ${projection.scopeId}`);
        const request = new GetAllRequest();
        request.setCallcontext(callContexts.toProtobuf(this._executionContext));
        request.setProjectionid(guids.toProtobuf(projection.identifier.value));
        request.setScopeid(guids.toProtobuf(projection.scopeId.value));
        return reactiveUnary(this._projectionsClient, this._projectionsClient.getAll, request, cancellation)
            .pipe(map(response => {
                this.throwIfHasFailure(response, projection);
                return this._converter.convertAll<TProjection>(response.getStatesList());
            })).toPromise();
    }

    private throwIfHasFailure(response: GetOneResponse | GetAllResponse, projection: ProjectionAssociation, key?: Key) {
        if (response.hasFailure()) {
            throw new FailedToGetProjection(
                projection.identifier,
                projection.scopeId,
                key,
                failures.toSDK(response.getFailure())!);
        }
    }

    private throwIfNoState(response: GetOneResponse, projection: ProjectionAssociation, key: Key) {
        if (!response.hasState()) {
            throw new FailedToGetProjectionState(projection.identifier, projection.scopeId, key);
        }
    }
}
