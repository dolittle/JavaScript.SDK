// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

export {
    CannotRegisterEmbeddingThatIsNotAClass,
    resolveUpdateToEvents,
    UpdateDecoratedMethod,
    UpdateDecoratedMethods, embedding,
    EmbeddingAlreadyHasAnUpdateDecorator,
    EmbeddingAlreadyHasAnUpdateMethod,
    EmbeddingAlreadyHasADeletionDecorator,
    EmbeddingAlreadyHasADeletionMethod,
    EmbeddingBuilder,
    EmbeddingBuilderForReadModel,
    EmbeddingClassBuilder,
    EmbeddingClassUpdateMethod,
    EmbeddingClassDeletionMethod,
    EmbeddingClassOnMethod,
    EmbeddingDecoratedType,
    EmbeddingDecoratedTypes,
    EmbeddingsBuilder,
    EmbeddingsBuilderCallback,
    ICanBuildAndRegisterAnEmbedding,
    on,
    OnDecoratedEmbeddingMethod,
    OnDecoratedEmbeddingMethods,
    ReadModelAlreadyDefinedForEmbedding,
    resolveDeletionToEvents,
    DeletionDecoratedMethod,
    DeletionDecoratedMethods
} from './Builder';
export { Embedding } from './Embedding';
export { EmbeddingUpdateCallback } from './EmbeddingUpdateCallback';
export { EmbeddingContext } from './EmbeddingContext';
export { EmbeddingDeleteCallback } from './EmbeddingDeleteCallback';
export { EmbeddingId } from './EmbeddingId';
export { EmbeddingProjectCallback } from './EmbeddingProjectCallback';
export { EmbeddingProjectContext } from './EmbeddingProjectContext';
export { IEmbeddings } from './IEmbeddings';
export { Embeddings } from './Embeddings';
export { FailedToDelete } from './FailedToDelete';
export { FailedToGetUpdatedState } from './FailedToGetUpdatedState';
export { IEmbedding } from './IEmbedding';
export * as internal from './Internal';
export { MissingEmbeddingInformation } from './MissingEmbeddingInformation';
export {CouldNotResolveDeletionToEvents} from './CouldNotResolveDeletionToEvents';
export {CouldNotResolveUpdateToEvents} from './CouldNotResolveUpdateToEvents';
export {
    EmbeddingStore,
    EmbeddingStoreBuilder,
    FailedToGetEmbedding,
    FailedToGetEmbeddingKeys,
    FailedToGetEmbeddingState,
    IEmbeddingStore
} from './Store';
