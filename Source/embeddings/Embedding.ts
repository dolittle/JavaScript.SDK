// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { map } from 'rxjs/operators';
import { Logger } from 'winston';
import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { ExecutionContext } from '@dolittle/sdk.execution';
import { CurrentState, IConvertProjectionsToSDK, Key } from '@dolittle/sdk.projections';
import { ExecutionContexts, Failures, Guids } from '@dolittle/sdk.protobuf';
import { Cancellation } from '@dolittle/sdk.resilience';
import { reactiveUnary } from '@dolittle/sdk.services';

import { DeleteRequest, DeleteResponse, UpdateRequest, UpdateResponse } from '@dolittle/runtime.contracts/Embeddings/Embeddings_pb';
import { EmbeddingsClient } from '@dolittle/runtime.contracts/Embeddings/Embeddings_grpc_pb';
import { EmbeddingStoreClient } from '@dolittle/runtime.contracts/Embeddings/Store_grpc_pb';

import { IEmbeddingReadModelTypes } from './Store/IEmbeddingReadModelTypes';
import { EmbeddingId } from './EmbeddingId';
import { IEmbedding } from './IEmbedding';
import { FailedToDelete } from './FailedToDelete';
import { FailedToGetUpdatedState } from './FailedToGetUpdatedState';
import { FailedToUpdate } from './FailedToUpdate';

/**
 * Represents an implementation of {@link IEmbedding}.
 */
export class Embedding extends IEmbedding {
    /**
     * Initialises a new instance of the {@link Embedding} class.
     * @param {EmbeddingStoreClient} storeClient - The embedding store client.
     * @param {ExecutionContext} _executionContext - The execution context.
     * @param {IConvertProjectionsToSDK} _converter - The converter to use to convert projections.
     * @param {IEmbeddingReadModelTypes} _readModelTypes - The projection associations.
     * @param {EmbeddingsClient} _embeddingsClient - The embeddings client.
     * @param {Logger} _logger - The logger.
     */
    constructor(
        storeClient: EmbeddingStoreClient,
        _executionContext: ExecutionContext,
        _converter: IConvertProjectionsToSDK,
        _readModelTypes: IEmbeddingReadModelTypes,
        private readonly _embeddingsClient: EmbeddingsClient,
        _logger: Logger) {
        super(storeClient, _executionContext, _converter, _readModelTypes, _logger);
    }

    /** @inheritdoc */
    update<TEmbedding>(
        type: Constructor<TEmbedding>,
        key: Key | string,
        state: TEmbedding,
        cancellation?: Cancellation): Promise<CurrentState<TEmbedding>>;
    /** @inheritdoc */
    update<TEmbedding>(
            type: Constructor<TEmbedding>,
        key: Key | string,
        embedding: string | EmbeddingId | Guid,
        state: TEmbedding,
        cancellation?: Cancellation): Promise<CurrentState<TEmbedding>>;
    /** @inheritdoc */
    update(
        key: Key | string,
        embedding: EmbeddingId | Guid | string,
        state: any,
        cancellation?: Cancellation): Promise<CurrentState<any>>;
    async update<TEmbedding = any>(
        typeOrKey: Constructor<TEmbedding> | Key | string,
        keyOrEmbedding: Key | EmbeddingId | Guid | string,
        stateOrEmbedding: TEmbedding | any | EmbeddingId | Guid | string,
        maybeCancellationOrState: Cancellation | undefined | TEmbedding,
        maybeCancellation?: Cancellation): Promise<CurrentState<TEmbedding>> {
        const type = typeof typeOrKey === 'function'
            ? typeOrKey as Constructor<TEmbedding>
            : undefined;
        const key = this.getKeyFrom(typeOrKey, keyOrEmbedding);
        const embedding = this.getEmbeddingForUpdate(type, keyOrEmbedding, stateOrEmbedding);
        const state = this.getState(stateOrEmbedding, maybeCancellationOrState);
        const cancellation = this.getCancellationFromMaybe(maybeCancellationOrState, maybeCancellation);
        this._logger.debug(`Updating one state from embedding ${embedding} with key ${key}`);

        const request = new UpdateRequest();
        request.setCallcontext(ExecutionContexts.toCallContext(this._executionContext));
        request.setKey(key.value);
        request.setEmbeddingid(Guids.toProtobuf(embedding.value));
        request.setState(JSON.stringify(state));

        return reactiveUnary(this._embeddingsClient, this._embeddingsClient.update, request, cancellation)
            .pipe(map(response => {
                    this.throwIfResponseHasFailure(response, embedding);
                    this.throwIfNoStateInResponse(response, embedding, key);
                    return this._converter.convert<TEmbedding>(type, response.getState()!);
                })).toPromise();
    }

    /** @inheritdoc */
    delete<TEmbedding>(
        type: Constructor<TEmbedding>,
        key: Key | string,
        cancellation?: Cancellation): Promise<void>;
    /** @inheritdoc */
    delete(
        key: Key | string,
        embeddingId: EmbeddingId | Guid | string,
        cancellation?: Cancellation): Promise<void>;
    async delete<TEmbedding = any>(
        typeOrKey: Constructor<TEmbedding> | Key | string,
        keyOrEmbeddingId: Key | EmbeddingId | Guid | string,
        maybeCancellation?: Cancellation): Promise<void> {
        const key = this.getKeyFrom(typeOrKey, keyOrEmbeddingId);
        const embedding = this.getEmbeddingForDelete(typeOrKey, keyOrEmbeddingId);
        const cancellation = maybeCancellation || Cancellation.default;
        this._logger.debug(`Removing one state from embedding ${embedding} with key ${key}`);

        const request = new DeleteRequest();
        request.setCallcontext(ExecutionContexts.toCallContext(this._executionContext));
        request.setKey(key.value);
        request.setEmbeddingid(Guids.toProtobuf(embedding.value));

        return reactiveUnary(this._embeddingsClient, this._embeddingsClient.delete, request, cancellation)
            .pipe(map(response => {
                    this.throwIfResponseHasFailure(response, embedding);
                })).toPromise();
    }

    private getKeyFrom<TEmbedding>(typeOrKey: Constructor<TEmbedding> | Key | string, keyOrEmbedding: Key | EmbeddingId | Guid | string): Key {
        if (typeof typeOrKey === 'function') {
            return Key.from(keyOrEmbedding);
        }
        return Key.from(typeOrKey);
    }

    private getEmbeddingForUpdate<TEmbedding>(
        maybeType: Constructor<any> | undefined,
        keyOrEmbedding: Key | EmbeddingId | Guid | string,
        stateOrEmbedding: TEmbedding | any | EmbeddingId | Guid | string) {
        if (maybeType === undefined) {
            return EmbeddingId.from(keyOrEmbedding.toString());
        } else {
            if (this.isEmbeddingId(stateOrEmbedding)) {
                return EmbeddingId.from(stateOrEmbedding);
            }
            return this._readModelTypes.getFor(maybeType!);
        }
    }

    private getEmbeddingForDelete<TEmbedding>(
        maybeType: Constructor<any> | Key | string,
        keyOrEmbedding: Key | EmbeddingId | Guid | string) {
        if (typeof maybeType === 'function') {
            return this._readModelTypes.getFor(maybeType);
        }
        return EmbeddingId.from(keyOrEmbedding.toString());
    }

    private getState<TEmbedding = any>(
        stateOrEmbedding: TEmbedding | any | EmbeddingId | Guid | string,
        maybeCancellationOrState: Cancellation | undefined | TEmbedding): TEmbedding {
        if (this.isEmbeddingId(stateOrEmbedding)) {
            return maybeCancellationOrState as any;
        }
        return stateOrEmbedding;
    }

    private getCancellationFromMaybe(maybeCancellationOrState: Cancellation | undefined | any, maybeCancellation: Cancellation | undefined) {
        if (maybeCancellationOrState instanceof Cancellation) {
            return maybeCancellationOrState;
        }
        if (maybeCancellation instanceof Cancellation) {
            return maybeCancellation;
        }
        return Cancellation.default;
    }

    private throwIfResponseHasFailure(response: UpdateResponse | DeleteResponse, embedding: EmbeddingId, key?: Key) {
        if (response.hasFailure()) {
            if (response instanceof UpdateResponse) {
                throw new FailedToUpdate(embedding, key, Failures.toSDK(response.getFailure()!));
            }
            throw new FailedToDelete(embedding, key, Failures.toSDK(response.getFailure()!));
        }
    }

    private throwIfNoStateInResponse(response: UpdateResponse, embedding: EmbeddingId, key: Key) {
        if (!response.hasState()) {
            throw new FailedToGetUpdatedState(embedding, key);
        }
    }
    private isEmbeddingId(value: any): value is EmbeddingId | Guid | string {
        return value instanceof EmbeddingId || value instanceof Guid || typeof value === 'string';
    }
}
