// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

export {
    CannotRegisterEmbeddingThatIsNotAClass,
    resolveDeletionToEvents,
    DeletionDecoratedMethod,
    DeletionDecoratedMethods,
    EmbeddingAlreadyHasADeletionDecorator,
    EmbeddingAlreadyHasADeletionMethod,
    EmbeddingAlreadyHasAnUpdateDecorator,
    EmbeddingAlreadyHasAnUpdateMethod,
    EmbeddingBuilder,
    EmbeddingBuilderForReadModel,
    EmbeddingClassBuilder,
    EmbeddingClassDeletionMethod,
    EmbeddingClassOnMethod,
    EmbeddingClassUpdateMethod,
    EmbeddingDecoratedType,
    EmbeddingDecoratedTypes,
    embedding,
    EmbeddingsBuilder,
    EmbeddingsBuilderCallback,
    IEmbeddingBuilder,
    IEmbeddingBuilderForReadModel,
    IEmbeddingsBuilder,
    OnDecoratedEmbeddingMethod,
    OnDecoratedEmbeddingMethods,
    on,
    ReadModelAlreadyDefinedForEmbedding,
    UpdateDecoratedMethod,
    UpdateDecoratedMethods,
    resolveUpdateToEvents,
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
    EmbeddingStoreBuilder,
    EmbeddingStore,
    FailedToGetEmbedding,
    FailedToGetEmbeddingKeys,
    FailedToGetEmbeddingState,
    IEmbeddingStore,
} from './Store';
