// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { map } from 'rxjs/operators';
import { Logger } from 'winston';
import { Guid } from '@dolittle/rudiments';

import { ScopeId } from '@dolittle/sdk.events';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { ExecutionContexts, Failures, Guids } from '@dolittle/sdk.protobuf';
import { Cancellation } from '@dolittle/sdk.resilience';
import { reactiveUnary } from '@dolittle/sdk.services';
import { Constructor } from '@dolittle/types';

import { ProjectionsClient } from '@dolittle/runtime.contracts/Projections/Store_grpc_pb';
import { GetAllRequest, GetAllResponse, GetOneRequest, GetOneResponse } from '@dolittle/runtime.contracts/Projections/Store_pb';

import { Key } from '../Key';
import { ProjectionId } from '../ProjectionId';
import { IConvertProjectionsToSDK } from './Converters/IConvertProjectionsToSDK';
import { ProjectionsToSDKConverter } from './Converters/ProjectionsToSDKConverter';
import { CurrentState } from './CurrentState';
import { FailedToGetProjection } from './FailedToGetProjection';
import { FailedToGetProjectionState } from './FailedToGetProjectionState';
import { IProjectionAssociations } from './IProjectionAssociations';
import { IProjectionStore } from './IProjectionStore';

/**
 * Represents an implementation of {@link IProjectionStore}.
 */
export class ProjectionStore extends IProjectionStore {

    private _converter: IConvertProjectionsToSDK = new ProjectionsToSDKConverter();

    /**
     * Initialises a new instance of the {@link ProjectionStore} class.
     * @param {ProjectionsClient} _projectionsClient - The projections client to use to get projection states.
     * @param {ExecutionContext} _executionContext - The execution context of the client.
     * @param {IProjectionAssociations} _projectionAssociations - All the types associated with projections.
     * @param {Logger} _logger - The logger to use for logging.
     */
    constructor(
        private readonly _projectionsClient: ProjectionsClient,
        private readonly _executionContext: ExecutionContext,
        private readonly _projectionAssociations: IProjectionAssociations,
        private readonly _logger: Logger) {
        super();
    }

    /** @inheritdoc */
    get<TProjection>(type: Constructor<TProjection>, key: Key | any, cancellation?: Cancellation): Promise<CurrentState<TProjection>>;
    get<TProjection>(type: Constructor<TProjection>, key: Key | any, projection: ProjectionId | Guid | string, cancellation?: Cancellation): Promise<CurrentState<TProjection>>;
    get<TProjection>(type: Constructor<TProjection>, key: Key | any, projection: ProjectionId | Guid | string, scope: ScopeId, cancellation?: Cancellation): Promise<CurrentState<TProjection>>;
    get(key: Key | any, projection: ProjectionId | Guid | string, cancellation?: Cancellation): Promise<CurrentState<any>>;
    get(key: Key | any, projection: ProjectionId | Guid | string, scope: ScopeId | Guid | string, cancellation?: Cancellation): Promise<CurrentState<any>>;
    get<TProjection = any>(typeOrKey: Constructor<TProjection> | Key | any, keyOrProjection: Key | any | ProjectionId | Guid | string, maybeCancellationOrProjectionOrScope?: Cancellation | ProjectionId | ScopeId | Guid | string, maybeCancellationOrScope?: Cancellation | ScopeId | Guid | string, maybeCancellation?: Cancellation): Promise<CurrentState<TProjection>> {
        const type = typeof typeOrKey === 'function'
            ? typeOrKey as Constructor<TProjection>
            : undefined;
        const key = this.getKeyFrom(typeOrKey, keyOrProjection);
        const [projection, scope] = this.getProjectionAndScopeForOne(type, keyOrProjection, maybeCancellationOrProjectionOrScope, maybeCancellationOrScope);
        const cancellation = this.getCancellationFrom(maybeCancellationOrProjectionOrScope, maybeCancellationOrScope, maybeCancellation);

        this._logger.debug(`Getting one state from projection ${projection} in scope ${scope} with key ${key}`);

        const request = new GetOneRequest();
        request.setCallcontext(ExecutionContexts.toCallContext(this._executionContext));
        request.setKey(key.value);
        request.setProjectionid(Guids.toProtobuf(projection.value));
        request.setScopeid(Guids.toProtobuf(scope.value));

        return reactiveUnary(this._projectionsClient, this._projectionsClient.getOne, request, cancellation)
            .pipe(map(response => {
                this.throwIfHasFailure(response, projection, scope, key);
                this.throwIfNoState(response, projection, scope, key);
                return this._converter.convert<TProjection>(type, response.getState()!);
            })).toPromise();
    }

    /** @inheritdoc */
    getAll<TProjection>(type: Constructor<TProjection>, cancellation?: Cancellation): Promise<Map<Key, CurrentState<TProjection>>>;
    getAll<TProjection>(type: Constructor<TProjection>, projection: ProjectionId | Guid | string, cancellation?: Cancellation): Promise<Map<Key, CurrentState<TProjection>>>;
    getAll<TProjection>(type: Constructor<TProjection>, projection: ProjectionId | Guid | string, scope: ScopeId | Guid | string, cancellation?: Cancellation): Promise<Map<Key, CurrentState<TProjection>>>;
    getAll(projection: ProjectionId | Guid | string, cancellation?: Cancellation): Promise<Map<Key, CurrentState<any>>>;
    getAll(projection: ProjectionId | Guid | string, scope: ScopeId | Guid | string, cancellation?: Cancellation): Promise<Map<Key, CurrentState<any>>>;
    getAll<TProjection = any>(typeOrProjection: Constructor<TProjection> | ProjectionId | Guid | string, maybeCancellationOrProjectionOrScope?: Cancellation | ProjectionId | ScopeId | Guid | string, maybeCancellationOrScope?: Cancellation | ScopeId | Guid | string, maybeCancellation?: Cancellation): Promise<Map<Key, CurrentState<TProjection>>> {
        const type = typeof typeOrProjection === 'function'
            ? typeOrProjection as Constructor<TProjection>
            : undefined;
        const [projection, scope] = this.getProjectionAndScopeForAll(type, typeOrProjection, maybeCancellationOrProjectionOrScope, maybeCancellationOrScope);
        const cancellation = this.getCancellationFrom(maybeCancellationOrProjectionOrScope, maybeCancellationOrScope, maybeCancellation);

        this._logger.debug(`Getting all states from projection ${projection} in scope ${scope}`);

        const request = new GetAllRequest();
        request.setCallcontext(ExecutionContexts.toCallContext(this._executionContext));
        request.setProjectionid(Guids.toProtobuf(projection.value));
        request.setScopeid(Guids.toProtobuf(scope.value));

        return reactiveUnary(this._projectionsClient, this._projectionsClient.getAll, request, cancellation)
            .pipe(map(response => {
                this.throwIfHasFailure(response, projection, scope);
                return this._converter.convertAll<TProjection>(type, response.getStatesList());
            })).toPromise();
    }

    private getKeyFrom<TProjection>(typeOrKey: Constructor<TProjection> | Key | any, keyOrProjection: Key | any | ProjectionId | Guid | string): Key {
        if (typeof typeOrKey === 'function') {
            return Key.from(keyOrProjection);
        }
        return Key.from(typeOrKey);
    }

    private getProjectionAndScopeForOne<TProjection>(type: Constructor<TProjection> | undefined, keyOrProjection: Key | any | ProjectionId | Guid | string, maybeProjectionOrCancellationOrScope?: ProjectionId | Cancellation | ScopeId | Guid | string, maybeCancellationOrScope?: Cancellation | ScopeId | Guid | string): [ProjectionId, ScopeId] {
        if (type === undefined) {
            if (maybeProjectionOrCancellationOrScope !== undefined && !(maybeProjectionOrCancellationOrScope instanceof Cancellation)) {
                return [ProjectionId.from(keyOrProjection), ScopeId.from(maybeProjectionOrCancellationOrScope as (ScopeId | Guid | string))];
            }
            return [ProjectionId.from(keyOrProjection), ScopeId.default];
        } else if (maybeProjectionOrCancellationOrScope instanceof ProjectionId || maybeProjectionOrCancellationOrScope instanceof Guid || typeof maybeProjectionOrCancellationOrScope === 'string') {
            if (maybeCancellationOrScope !== undefined && !(maybeCancellationOrScope instanceof Cancellation)) {
                return [ProjectionId.from(maybeProjectionOrCancellationOrScope), ScopeId.from(maybeCancellationOrScope)];
            }
            return [ProjectionId.from(maybeProjectionOrCancellationOrScope), ScopeId.default];
        }
        const projection = this._projectionAssociations.getFor<TProjection>(type!);
        return [projection.identifier, projection.scope];
    }

    private getProjectionAndScopeForAll<TProjection>(type: Constructor<TProjection> | undefined, typeOrProjection: Constructor<TProjection> | ProjectionId | Guid | string, maybeCancellationOrProjectionOrScope?: Cancellation | ProjectionId | ScopeId | Guid | string, maybeCancellationOrScope?: Cancellation | ScopeId | Guid | string): [ProjectionId, ScopeId] {
        if (typeOrProjection instanceof ProjectionId || typeOrProjection instanceof Guid || typeof typeOrProjection === 'string') {
            if (maybeCancellationOrProjectionOrScope !== undefined && !(maybeCancellationOrProjectionOrScope instanceof Cancellation)) {
                return [ProjectionId.from(typeOrProjection), ScopeId.from(maybeCancellationOrProjectionOrScope as (ScopeId | Guid | string))];
            }
            return [ProjectionId.from(typeOrProjection), ScopeId.default];
        } else if (maybeCancellationOrProjectionOrScope instanceof ProjectionId || maybeCancellationOrProjectionOrScope instanceof Guid || typeof maybeCancellationOrProjectionOrScope === 'string') {
            if (maybeCancellationOrScope !== undefined && !(maybeCancellationOrScope instanceof Cancellation)) {
                return [ProjectionId.from(maybeCancellationOrProjectionOrScope), ScopeId.from(maybeCancellationOrScope)];
            }
            return [ProjectionId.from(maybeCancellationOrProjectionOrScope), ScopeId.default];
        }
        const projection = this._projectionAssociations.getFor<TProjection>(type!);
        return [projection.identifier, projection.scope];
    }

    private getCancellationFrom(maybeProjectionOrCancellationOrScope?: ProjectionId | Cancellation | ScopeId | Guid | string, maybeCancellationOrScope?: Cancellation | ScopeId | Guid | string, maybeCancellation?: Cancellation): Cancellation {
        if (maybeProjectionOrCancellationOrScope instanceof Cancellation) {
            return maybeProjectionOrCancellationOrScope;
        } else if (maybeCancellationOrScope instanceof Cancellation) {
            return maybeCancellationOrScope;
        } else if (maybeCancellation instanceof Cancellation) {
            return maybeCancellation;
        }
        return Cancellation.default;
    }

    private throwIfHasFailure(response: GetOneResponse | GetAllResponse, projection: ProjectionId, scope: ScopeId, key?: Key) {
        if (response.hasFailure()) {
            throw new FailedToGetProjection(projection, scope, key, Failures.toSDK(response.getFailure()!));
        }
    }

    private throwIfNoState(response: GetOneResponse, projection: ProjectionId, scope: ScopeId, key: Key) {
        if (!response.hasState()) {
            throw new FailedToGetProjectionState(projection, scope, key);
        }
    }
}
