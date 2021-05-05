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
export { Embedding } from './Embedding';
export { EmbeddingCompareCallback } from './EmbeddingCompareCallback';
export { EmbeddingContext } from './EmbeddingContext';
export { EmbeddingDeleteCallback } from './EmbeddingDeleteCallback';
export { EmbeddingId } from './EmbeddingId';
export { EmbeddingProjectCallback } from './EmbeddingProjectCallback';
export { EmbeddingProjectContext } from './EmbeddingProjectContext';
export { Embeddings } from './Embeddings';
export { IEmbedding } from './IEmbedding';
export { IEmbeddings } from './IEmbeddings';
export * as internal from './Internal';
export { MissingEmbeddingInformation } from './MissingEmbeddingInformation';
export {
    EmbeddingStore,
    EmbeddingStoreBuilder, FailedToGetEmbedding,
    FailedToGetEmbeddingKeys,
    FailedToGetEmbeddingState,
    IEmbeddingStore
} from './Store';
