// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

export {
    CannotRegisterEmbeddingThatIsNotAClass,
    compare,
    CompareDecoratedMethod,
    CompareDecoratedMethods,
    DeleteDecoratedMethod,
    DeleteDecoratedMethods,
    deleteMethod,
    embedding,
    EmbeddingAlreadyHasACompareDecorator,
    EmbeddingAlreadyHasACompareMethod,
    EmbeddingAlreadyHasADeleteDecorator,
    EmbeddingAlreadyHasADeleteMethod,
    EmbeddingBuilder,
    EmbeddingBuilderForReadModel,
    EmbeddingClassBuilder,
    EmbeddingClassCompareMethod,
    EmbeddingClassDeleteMethod,
    EmbeddingClassOnMethod,
    EmbeddingDecoratedType,
    EmbeddingDecoratedTypes,
    EmbeddingsBuilder,
    EmbeddingsBuilderCallback,
    ICanBuildAndRegisterAnEmbedding,
    on,
    OnDecoratedEmbeddingMethod,
    OnDecoratedEmbeddingMethods,
    ReadModelAlreadyDefinedForEmbedding
} from './Builder';
export { EmbeddingId } from './EmbeddingId';
export { FailedToDelete } from './FailedToDelete';
export { FailedToGetUpdatedState } from './FailedToGetUpdatedState';
export { IEmbedding } from './IEmbedding';
export { Embedding } from './Embedding';
export { Embeddings } from './Embeddings';
export { EmbeddingCompareCallback } from './EmbeddingCompareCallback';
export { EmbeddingContext } from './EmbeddingContext';
export { EmbeddingDeleteCallback } from './EmbeddingDeleteCallback';
export { EmbeddingProjectCallback } from './EmbeddingProjectCallback';
export { EmbeddingProjectContext } from './EmbeddingProjectContext';
export { MissingEmbeddingInformation } from './MissingEmbeddingInformation';
export * as internal from './Internal';
export {
    EmbeddingStore,
    EmbeddingStoreBuilder,
    FailedToGetEmbedding,
    FailedToGetEmbeddingKeys,
    FailedToGetEmbeddingState,
    IEmbeddingStore
} from './Store';
