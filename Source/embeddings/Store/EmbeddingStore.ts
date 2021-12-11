// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { map } from 'rxjs/operators';
import { Logger } from 'winston';

import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { ExecutionContext } from '@dolittle/sdk.execution';
import { CurrentState, IConvertProjectionsToSDK, IProjectionAssociations, Key } from '@dolittle/sdk.projections';
import { Cancellation } from '@dolittle/sdk.resilience';
import { reactiveUnary } from '@dolittle/sdk.services';

import { EmbeddingStoreClient } from '@dolittle/runtime.contracts/Embeddings/Store_grpc_pb';
import { GetAllRequest, GetAllResponse, GetKeysRequest, GetKeysResponse, GetOneRequest, GetOneResponse } from '@dolittle/runtime.contracts/Embeddings/Store_pb';

import { EmbeddingId } from '../EmbeddingId';
import { FailedToGetEmbedding } from './FailedToGetEmbedding';
import { FailedToGetEmbeddingKeys } from './FailedToGetEmbeddingKeys';
import { FailedToGetEmbeddingState } from './FailedToGetEmbeddingState';
import { IEmbeddingStore } from './IEmbeddingStore';

import '@dolittle/sdk.protobuf';

/**
 * Represents an implementation of {link IEmbeddingStore}.
 */
export class EmbeddingStore extends IEmbeddingStore {
    /**
     * Initializes an instance of the {@link EmbeddingStore} class.
     * @param {EmbeddingStoreClient} _embeddingsStoreClient - The embedding store client.
     * @param {ExecutionContext} _executionContext - The execution context.
     * @param {IConvertProjectionsToSDK} _converter - The converter to use to convert projections.
     * @param {IProjectionAssociations} _projectionAssociations - The projection associations.
     * @param {Logger} _logger - The logger.
     */
    constructor(
        private readonly _embeddingsStoreClient: EmbeddingStoreClient,
        protected readonly _executionContext: ExecutionContext,
        protected readonly _converter: IConvertProjectionsToSDK,
        protected readonly _projectionAssociations: IProjectionAssociations,
        protected readonly _logger: Logger) {
            super();
        }

    /** @inheritdoc */
    get<TEmbedding>(type: Constructor<TEmbedding>, key: any, cancellation?: Cancellation): Promise<CurrentState<TEmbedding>>;
    get<TEmbedding>(type: Constructor<TEmbedding>, key: any, embedding: string | EmbeddingId | Guid, cancellation?: Cancellation): Promise<CurrentState<TEmbedding>>;
    get(key: any, embedding: string | EmbeddingId | Guid, cancellation?: Cancellation): Promise<CurrentState<any>>;
    get<TEmbedding = any>(
        typeOrKey: any | Constructor<TEmbedding>,
        keyOrEmbedding: any | string | EmbeddingId | Guid,
        embeddingOrCancellation?: string | EmbeddingId | Guid | Cancellation,
        maybeCancellation?: Cancellation): Promise<CurrentState<TEmbedding>> {
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
        request.setCallcontext(this._executionContext.toCallContext());
        request.setKey(key.value);
        request.setEmbeddingid(embedding.value.toProtobuf());

        return reactiveUnary(this._embeddingsStoreClient, this._embeddingsStoreClient.getOne, request, cancellation)
            .pipe(map(response => {
                this.throwIfHasFailure(response, embedding, key);
                this.throwIfNoState(response, embedding, key);
                return this._converter.convert<TEmbedding>(type, response.getState()!);
            })).toPromise();
    }

    /** @inheritdoc */
    getAll<TEmbedding>(type: Constructor<TEmbedding>, cancellation?: Cancellation): Promise<Map<Key, CurrentState<TEmbedding>>>;
    getAll<TEmbedding>(type: Constructor<TEmbedding>, embedding: string | EmbeddingId | Guid, cancellation?: Cancellation): Promise<Map<Key, CurrentState<TEmbedding>>>;
    getAll(embedding: string | EmbeddingId | Guid, cancellation?: Cancellation): Promise<Map<Key, CurrentState<any>>>;
    getAll<TEmbedding = any>(
        typeOrEmbedding: Constructor<TEmbedding> | string | EmbeddingId | Guid,
        embeddingOrCancellation?: string | EmbeddingId | Guid | Cancellation,
        maybeCancellation?: Cancellation): Promise<Map<Key, CurrentState<TEmbedding>>> {
        const type = typeof typeOrEmbedding === 'function'
            ? typeOrEmbedding as Constructor<TEmbedding>
            : undefined;
        const embedding = this.getEmbeddingForAll(type, typeOrEmbedding, embeddingOrCancellation);

        const cancellation = this.getCancellation(embeddingOrCancellation, maybeCancellation);

        this._logger.debug(`Getting all states from embedding ${embedding}`);

        const request = new GetAllRequest();
        request.setCallcontext(this._executionContext.toCallContext());
        request.setEmbeddingid(embedding.value.toProtobuf());

        return reactiveUnary(this._embeddingsStoreClient, this._embeddingsStoreClient.getAll, request, cancellation)
            .pipe(map(response => {
                this.throwIfHasFailure(response, embedding);
                return this._converter.convertAll<TEmbedding>(type, response.getStatesList());
            })).toPromise();
    }

    /** @inheritdoc */
    getKeys<TEmbedding>(type: Constructor<TEmbedding>, cancellation?: Cancellation): Promise<Key[]>;
    getKeys<TEmbedding>(type: Constructor<TEmbedding>, embedding: string | EmbeddingId | Guid, cancellation?: Cancellation): Promise<Key[]>;
    getKeys(embedding: string | EmbeddingId | Guid, cancellation?: Cancellation): Promise<Key[]>;
    getKeys<TEmbedding = any>(
        typeOrEmbedding: Constructor<TEmbedding> | string | EmbeddingId | Guid,
        embeddingOrCancellation?: string | EmbeddingId | Guid | Cancellation,
        maybeCancellation?: Cancellation): Promise<Key[]> {
        const type = typeof typeOrEmbedding === 'function'
            ? typeOrEmbedding as Constructor<TEmbedding>
            : undefined;
        const embedding = this.getEmbeddingForAll(type, typeOrEmbedding, embeddingOrCancellation);

        const cancellation = this.getCancellation(embeddingOrCancellation, maybeCancellation);

        this._logger.debug(`Getting all keys for embedding ${embedding}`);

        const request = new GetKeysRequest();
        request.setCallcontext(this._executionContext.toCallContext());
        request.setEmbeddingid(embedding.value.toProtobuf());

        return reactiveUnary(this._embeddingsStoreClient, this._embeddingsStoreClient.getKeys, request, cancellation)
            .pipe(map(response => {
                this.throwIfHasFailure(response, embedding);
                return response.getKeysList().map(pbKey => Key.from(pbKey));
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
        }
        if (type) {
            return EmbeddingId.from(this._projectionAssociations.getFor<TEmbedding>(type!).identifier.value);
        }
        return EmbeddingId.from(keyOrEmbedding);
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
        if (type) {
            return EmbeddingId.from(this._projectionAssociations.getFor<TEmbedding>(type!).identifier.value);
        }
        return EmbeddingId.from(typeOrEmbedding as string);
    }

    private getCancellation(embeddingOrCancellation: string | EmbeddingId | Guid | Cancellation | undefined, maybeCancellation: Cancellation | undefined) {
        return embeddingOrCancellation instanceof Cancellation
            ? embeddingOrCancellation
            : maybeCancellation || Cancellation.default;
    }

    private throwIfHasFailure(response: GetOneResponse | GetAllResponse | GetKeysResponse, embedding: EmbeddingId, key?: Key) {
        if (response.hasFailure()) {
            if (response instanceof GetKeysResponse) {
                throw new FailedToGetEmbeddingKeys(embedding, response.getFailure()!.toSDK());
            }
            throw new FailedToGetEmbedding(embedding, key, response.getFailure()!.toSDK());
        }
    }

    private throwIfNoState(response: GetOneResponse, embedding: EmbeddingId, key: Key) {
        if (!response.hasState()) {
            throw new FailedToGetEmbeddingState(embedding, key);
        }
    }
}
