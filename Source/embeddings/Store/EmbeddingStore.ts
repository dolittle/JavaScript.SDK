// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';
import { map } from 'rxjs/operators';

import { Guid } from '@dolittle/rudiments';
import { ScopeId } from '@dolittle/sdk.events';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { Cancellation } from '@dolittle/sdk.resilience';
import { reactiveUnary } from '@dolittle/sdk.services';
import { callContexts, failures, guids } from '@dolittle/sdk.protobuf';
import { Constructor } from '@dolittle/types';

import { EmbeddingsClient } from '@dolittle/runtime.contracts/Embeddings/Store_grpc_pb';
import { GetOneRequest, GetOneResponse, GetAllRequest, GetAllResponse } from '@dolittle/runtime.contracts/Embeddings/Store_pb';

import { EmbeddingId } from '..';

import { CurrentState } from './CurrentState';
import { IEmbeddingStore } from './IEmbeddingStore';
import { IEmbeddingAssociations } from './IEmbeddingAssociations';
import { FailedToGetEmbedding } from './FailedToGetEmbedding';
import { EmbeddingsToSDKConverter } from './Converters/EmbeddingsToSDKConverter';
import { IConvertEmbeddingsToSDK } from './Converters/IConvertEmbeddingsToSDK';
import { FailedToGetEmbeddingState } from './FailedToGetEmbeddingState';
import { Key } from '@dolittle/sdk.projections';

export class EmbeddingStore implements IEmbeddingStore {

    private _converter: IConvertEmbeddingsToSDK = new EmbeddingsToSDKConverter();

    constructor(
        private readonly _embeddingsClient: EmbeddingsClient,
        private readonly _executionContext: ExecutionContext,
        private readonly _embeddingAssociations: IEmbeddingAssociations,
        private readonly _logger: Logger) {}

    /** @inheritdoc */
    get<TEmbedding>(type: Constructor<TEmbedding>, key: any, cancellation?: Cancellation): Promise<any>;
    get<TEmbedding>(type: Constructor<TEmbedding>, key: any, embedding: string | EmbeddingId | Guid, cancellation?: Cancellation): Promise<any>;
    get<TEmbedding>(type: Constructor<TEmbedding>, key: any, embedding: string | EmbeddingId | Guid, cancellation?: Cancellation): Promise<any>;
    get(key: any, embedding: string | EmbeddingId | Guid, cancellation?: Cancellation): Promise<any>;
    get(key: any, embedding: string | EmbeddingId | Guid, cancellation?: Cancellation): Promise<any>;
    get<TEmbedding = any>(typeOrKey: any | Constructor<TEmbedding>, keyOrEmbedding: any | string | EmbeddingId | Guid, embeddingOrCancellation?: string | EmbeddingId | Guid | Cancellation, maybeCancellation?: Cancellation) {
        const type = typeof typeOrKey === 'function'
            ? typeOrKey as Constructor<TEmbedding>
            : undefined;
        const key = typeof typeOrKey === 'function'
            ? Key.from(keyOrEmbedding)
            : Key.from(typeOrKey);
        let cancellation = embeddingOrCancellation instanceof Cancellation
            ? embeddingOrCancellation
            : maybeCancellation;
        let embedding;
        if (embeddingOrCancellation instanceof Cancellation) {
            embedding = EmbeddingId.from(keyOrEmbedding);
        } else if (embeddingOrCancellation) {
            embedding = EmbeddingId.from(embeddingOrCancellation);
        } else {
            // @joel what us moking make this projecitonassociatoins or something
            embedding = this._embeddingAssociations.getFor<TEmbedding>(type!);
        }

        const [embedding, scope] = this.getEmbeddingAndScopeForOne(typeOrKey, keyOrEmbedding, maybeEmbeddingOrCancellationOrScope, maybeCancellationOrScope);
        const cancellation = this.getCancellationFrom(maybeEmbeddingOrCancellationOrScope, maybeCancellationOrScope, maybeCancellation);

        this._logger.debug(`Getting one state from embedding ${embeddingOrCancellation} in scope ${scope} with key ${keyOrEmbedding}`);

        const request = new GetOneRequest();
        request.setCallcontext(callContexts.toProtobuf(this._executionContext));
        request.setKey(keyOrEmbedding.value);
        request.setEmbeddingid(guids.toProtobuf(embeddingOrCancellation.value));
        request.setScopeid(guids.toProtobuf(scope.value));

        return reactiveUnary(this._embeddingsClient, this._embeddingsClient.getOne, request, maybeCancellation)
            .pipe(map(response => {
                this.throwIfHasFailure(response, embeddingOrCancellation, scope, keyOrEmbedding);
                this.throwIfNoState(response, embeddingOrCancellation, scope, keyOrEmbedding);
                return this._converter.convert<TEmbedding>(typeOrKey, response.getState()!);
            })).toPromise();
    }

    /** @inheritdoc */
    getAll<TEmbedding>(type: Constructor<TEmbedding>, cancellation?: Cancellation): Promise<Map<any, any>>;
    getAll<TEmbedding>(type: Constructor<TEmbedding>, embedding: string | EmbeddingId | Guid, cancellation?: Cancellation): Promise<Map<any, any>>;
    getAll<TEmbedding>(type: Constructor<TEmbedding>, embedding: string | EmbeddingId | Guid, cancellation?: Cancellation): Promise<Map<any, any>>;
    getAll(embedding: string | EmbeddingId | Guid, cancellation?: Cancellation): Promise<Map<any, any>>;
    getAll(embedding: string | EmbeddingId | Guid, cancellation?: Cancellation): Promise<Map<any, any>>;
    getAll(type: any, embedding?: any, cancellation?: any) {
        const type = typeof typeOrEmbedding === 'function'
            ? typeOrEmbedding as Constructor<TEmbedding>
            : undefined;
        const [embedding, scope] = this.getEmbeddingAndScopeForAll(type, typeOrEmbedding, maybeCancellationOrEmbeddingOrScope, maybeCancellationOrScope);
        const cancellation = this.getCancellationFrom(maybeCancellationOrEmbeddingOrScope, maybeCancellationOrScope, maybeCancellation);

        this._logger.debug(`Getting all states from embedding ${embedding} in scope ${scope}`);

        const request = new GetAllRequest();
        request.setCallcontext(callContexts.toProtobuf(this._executionContext));
        request.setEmbeddingid(guids.toProtobuf(embedding.value));
        request.setScopeid(guids.toProtobuf(scope.value));

        return reactiveUnary(this._embeddingsClient, this._embeddingsClient.getAll, request, cancellation)
            .pipe(map(response => {
                this.throwIfHasFailure(response, embedding, scope);
                return this._converter.convertAll<TEmbedding>(type, response.getStatesList());
            })).toPromise();
    }

    private getKeyFrom<TEmbedding>(typeOrKey: Constructor<TEmbedding> | Key | any, keyOrEmbedding: Key | any | EmbeddingId | Guid | string): Key {
        if (typeof typeOrKey === 'function') {
            return Key.from(keyOrEmbedding);
        }
        return Key.from(typeOrKey);
    }

    private getEmbeddingAndScopeForOne<TEmbedding>(type: Constructor<TEmbedding> | undefined, keyOrEmbedding: Key | any | EmbeddingId | Guid | string, maybeEmbeddingOrCancellationOrScope?: EmbeddingId | Cancellation | ScopeId | Guid | string, maybeCancellationOrScope?: Cancellation | ScopeId | Guid | string): [EmbeddingId, ScopeId] {
        if (type === undefined) {
            if (maybeEmbeddingOrCancellationOrScope !== undefined && !(maybeEmbeddingOrCancellationOrScope instanceof Cancellation)) {
                return [EmbeddingId.from(keyOrEmbedding), ScopeId.from(maybeEmbeddingOrCancellationOrScope as (ScopeId | Guid | string))];
            }
            return [EmbeddingId.from(keyOrEmbedding), ScopeId.default];
        } else if (maybeEmbeddingOrCancellationOrScope instanceof EmbeddingId || maybeEmbeddingOrCancellationOrScope instanceof Guid || typeof maybeEmbeddingOrCancellationOrScope === 'string') {
            if (maybeCancellationOrScope !== undefined && !(maybeCancellationOrScope instanceof Cancellation)) {
                return [EmbeddingId.from(maybeEmbeddingOrCancellationOrScope), ScopeId.from(maybeCancellationOrScope)];
            }
            return [EmbeddingId.from(maybeEmbeddingOrCancellationOrScope), ScopeId.default];
        }
        const embedding = this._embeddingAssociations.getFor<TEmbedding>(type!);
        return [embedding.identifier, embedding.scopeId];
    }

    private getEmbeddingAndScopeForAll<TEmbedding>(type: Constructor<TEmbedding> | undefined, typeOrEmbedding: Constructor<TEmbedding> | EmbeddingId | Guid | string, maybeCancellationOrEmbeddingOrScope?: Cancellation | EmbeddingId | ScopeId | Guid | string, maybeCancellationOrScope?: Cancellation | ScopeId | Guid | string): [EmbeddingId, ScopeId] {
        if (typeOrEmbedding instanceof EmbeddingId || typeOrEmbedding instanceof Guid || typeof typeOrEmbedding === 'string') {
            if (maybeCancellationOrEmbeddingOrScope !== undefined && !(maybeCancellationOrEmbeddingOrScope instanceof Cancellation)) {
                return [EmbeddingId.from(typeOrEmbedding), ScopeId.from(maybeCancellationOrEmbeddingOrScope as (ScopeId | Guid | string))];
            }
            return [EmbeddingId.from(typeOrEmbedding), ScopeId.default];
        } else if (maybeCancellationOrEmbeddingOrScope instanceof EmbeddingId || maybeCancellationOrEmbeddingOrScope instanceof Guid || typeof maybeCancellationOrEmbeddingOrScope === 'string') {
            if (maybeCancellationOrScope !== undefined && !(maybeCancellationOrScope instanceof Cancellation)) {
                return [EmbeddingId.from(maybeCancellationOrEmbeddingOrScope), ScopeId.from(maybeCancellationOrScope)];
            }
            return [EmbeddingId.from(maybeCancellationOrEmbeddingOrScope), ScopeId.default];
        }
        const embedding = this._embeddingAssociations.getFor<TEmbedding>(type!);
        return [embedding.identifier, embedding.scopeId];
    }

    private getCancellationFrom(maybeEmbeddingOrCancellationOrScope?: EmbeddingId | Cancellation | ScopeId | Guid | string, maybeCancellationOrScope?: Cancellation | ScopeId | Guid | string, maybeCancellation?: Cancellation): Cancellation {
        if (maybeEmbeddingOrCancellationOrScope instanceof Cancellation) {
            return maybeEmbeddingOrCancellationOrScope;
        } else if (maybeCancellationOrScope instanceof Cancellation) {
            return maybeCancellationOrScope;
        } else if (maybeCancellation instanceof Cancellation) {
            return maybeCancellation;
        }
        return Cancellation.default;
    }

    private throwIfHasFailure(response: GetOneResponse | GetAllResponse, embedding: EmbeddingId, scope: ScopeId, key?: Key) {
        if (response.hasFailure()) {
            throw new FailedToGetEmbedding(embedding, scope, key, failures.toSDK(response.getFailure())!);
        }
    }

    private throwIfNoState(response: GetOneResponse, embedding: EmbeddingId, scope: ScopeId, key: Key) {
        if (!response.hasState()) {
            throw new FailedToGetEmbeddingState(embedding, scope, key);
        }
    }
}
