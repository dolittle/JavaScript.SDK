// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

export {
    CannotRegisterEmbeddingThatIsNotAClass,
    resolveUpdateToEvents,
    CompareDecoratedMethod,
    CompareDecoratedMethods, embedding,
    EmbeddingAlreadyHasAnUpdateDecorator,
    EmbeddingAlreadyHasAnUpdateMethod,
    EmbeddingAlreadyHasADeletionDecorator,
    EmbeddingAlreadyHasADeletionMethod,
    EmbeddingBuilder,
    EmbeddingBuilderForReadModel,
    EmbeddingClassBuilder,
    EmbeddingClassCompareMethod,
    EmbeddingClassRemoveMethod,
    EmbeddingClassOnMethod,
    EmbeddingDecoratedType,
    EmbeddingDecoratedTypes,
    EmbeddingsBuilder,
    EmbeddingsBuilderCallback,
    ICanBuildAndRegisterAnEmbedding,
    on,
    OnDecoratedEmbeddingMethod,
    OnDecoratedEmbeddingMethods,
    ReadModelAlreadyDefinedForEmbedding, resolveDeletionToEvents, RemoveDecoratedMethod,
    RemoveDecoratedMethods
} from './Builder';
export { Embedding } from './Embedding';
export { EmbeddingCompareCallback } from './EmbeddingCompareCallback';
export { EmbeddingContext } from './EmbeddingContext';
export { EmbeddingDeleteCallback } from './EmbeddingDeleteCallback';
export { EmbeddingId } from './EmbeddingId';
export { EmbeddingProjectCallback } from './EmbeddingProjectCallback';
export { EmbeddingProjectContext } from './EmbeddingProjectContext';
export { Embeddings } from './Embeddings';
export { FailedToDelete } from './FailedToDelete';
export { FailedToGetUpdatedState } from './FailedToGetUpdatedState';
export { IEmbedding } from './IEmbedding';
export * as internal from './Internal';
export { MissingEmbeddingInformation } from './MissingEmbeddingInformation';
export {
    EmbeddingStore,
    EmbeddingStoreBuilder,
    FailedToGetEmbedding,
    FailedToGetEmbeddingKeys,
    FailedToGetEmbeddingState,
    IEmbeddingStore
} from './Store';
