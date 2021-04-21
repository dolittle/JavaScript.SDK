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
import { IConvertProjectionsToSDK, IProjectionAssociations, Key, ProjectionsToSDKConverter } from '@dolittle/sdk.projections';

import { EmbeddingsClient } from '@dolittle/runtime.contracts/Embeddings/Store_grpc_pb';
import { GetOneRequest, GetOneResponse, GetAllRequest, GetAllResponse } from '@dolittle/runtime.contracts/Embeddings/Store_pb';

import { EmbeddingId } from '..';

import { IEmbeddingStore } from './IEmbeddingStore';
import { FailedToGetEmbedding } from './FailedToGetEmbedding';
import { FailedToGetEmbeddingState } from './FailedToGetEmbeddingState';

export class EmbeddingStore implements IEmbeddingStore {

    private _converter: IConvertProjectionsToSDK = new ProjectionsToSDKConverter();

    constructor(
        private readonly _embeddingsClient: EmbeddingsClient,
        private readonly _executionContext: ExecutionContext,
        private readonly _projectionAssociations: IProjectionAssociations,
        private readonly _logger: Logger) {}

    /** @inheritdoc */
    get<TEmbedding>(type: Constructor<TEmbedding>, key: any, cancellation?: Cancellation): Promise<any>;
    get<TEmbedding>(type: Constructor<TEmbedding>, key: any, embedding: string | EmbeddingId | Guid, cancellation?: Cancellation): Promise<any>;
    get(key: any, embedding: string | EmbeddingId | Guid, cancellation?: Cancellation): Promise<any>;
    get<TEmbedding = any>(typeOrKey: any | Constructor<TEmbedding>, keyOrEmbedding: any | string | EmbeddingId | Guid, embeddingOrCancellation?: string | EmbeddingId | Guid | Cancellation, maybeCancellation?: Cancellation) {
        const type = typeof typeOrKey === 'function'
            ? typeOrKey as Constructor<TEmbedding>
            : undefined;
        const key = typeof typeOrKey === 'function'
            ? Key.from(keyOrEmbedding)
            : Key.from(typeOrKey);
        const embedding = this.getEmbeddingForOne(type, keyOrEmbedding, embeddingOrCancellation);
        const cancellation = this.getCancellation(embeddingOrCancellation, maybeCancellation);

        this._logger.debug(`Getting one state from embedding ${embedding} with key ${key}`);

        const request = new GetOneRequest();
        request.setCallcontext(callContexts.toProtobuf(this._executionContext));
        request.setKey(key.value);
        request.setEmbeddingid(guids.toProtobuf(embedding.value));

        return reactiveUnary(this._embeddingsClient, this._embeddingsClient.getOne, request, cancellation)
            .pipe(map(response => {
                this.throwIfHasFailure(response, embedding, key);
                this.throwIfNoState(response, embedding, key);
                return this._converter.convert<TEmbedding>(typeOrKey, response.getState()!);
            })).toPromise();
    }

    /** @inheritdoc */
    getAll<TEmbedding>(type: Constructor<TEmbedding>, cancellation?: Cancellation): Promise<Map<any, any>>;
    getAll<TEmbedding>(type: Constructor<TEmbedding>, embedding: string | EmbeddingId | Guid, cancellation?: Cancellation): Promise<Map<any, any>>;
    getAll(embedding: string | EmbeddingId | Guid, cancellation?: Cancellation): Promise<Map<any, any>>;
    getAll<TEmbedding = any>(typeOrEmbedding: Constructor<TEmbedding> | string | EmbeddingId | Guid, embeddingOrCancellation?: string | EmbeddingId | Guid | Cancellation, maybeCancellation?: Cancellation) {
        const type = typeof typeOrEmbedding === 'function'
            ? typeOrEmbedding as Constructor<TEmbedding>
            : undefined;
        const embedding = this.getEmbeddingForAll(type, typeOrEmbedding, embeddingOrCancellation);

        const cancellation = this.getCancellation(embeddingOrCancellation, maybeCancellation);

        this._logger.debug(`Getting all states from embedding ${embedding}`);

        const request = new GetAllRequest();
        request.setCallcontext(callContexts.toProtobuf(this._executionContext));
        request.setEmbeddingid(guids.toProtobuf(embedding.value));

        return reactiveUnary(this._embeddingsClient, this._embeddingsClient.getAll, request, cancellation)
            .pipe(map(response => {
                this.throwIfHasFailure(response, embedding);
                return this._converter.convertAll<TEmbedding>(type, response.getStatesList());
            })).toPromise();
    }

    private getEmbeddingForOne<TEmbedding>(type: Constructor<any> | undefined, keyOrEmbedding: any | string | EmbeddingId | Guid, embeddingOrCancellation?: string | EmbeddingId | Guid | Cancellation) {
        if (embeddingOrCancellation instanceof Cancellation) {
            if (type) {
                return EmbeddingId.from(this._projectionAssociations.getFor<TEmbedding>(type!).identifier.value);
            }
            return EmbeddingId.from(keyOrEmbedding);
        } else if (embeddingOrCancellation) {
            return EmbeddingId.from(embeddingOrCancellation);
        } else {
            return EmbeddingId.from(this._projectionAssociations.getFor<TEmbedding>(type!).identifier.value);
        }
    }

    private getEmbeddingForAll<TEmbedding>(type: Constructor<TEmbedding> | undefined, typeOrEmbedding: Constructor<TEmbedding> | string | EmbeddingId | Guid, embeddingOrCancellation?: string | EmbeddingId | Guid | Cancellation) {
        if (embeddingOrCancellation instanceof Cancellation) {
            if (typeof typeOrEmbedding === 'function') {
                return EmbeddingId.from(this._projectionAssociations.getFor<TEmbedding>(type!).identifier.value);
            }
            return EmbeddingId.from(typeOrEmbedding);
        } else if (embeddingOrCancellation) {
            return EmbeddingId.from(embeddingOrCancellation);
        }
        return EmbeddingId.from(this._projectionAssociations.getFor<TEmbedding>(type!).identifier.value);
    }

    private getCancellation(embeddingOrCancellation: string | EmbeddingId | Guid | Cancellation | undefined, maybeCancellation: Cancellation | undefined) {
        return embeddingOrCancellation instanceof Cancellation
            ? embeddingOrCancellation
            : maybeCancellation || Cancellation.default;
    }

    private throwIfHasFailure(response: GetOneResponse | GetAllResponse, embedding: EmbeddingId, key?: Key) {
        if (response.hasFailure()) {
            throw new FailedToGetEmbedding(embedding, key, failures.toSDK(response.getFailure())!);
        }
    }

    private throwIfNoState(response: GetOneResponse, embedding: EmbeddingId, key: Key) {
        if (!response.hasState()) {
            throw new FailedToGetEmbeddingState(embedding, key);
        }
    }
}
