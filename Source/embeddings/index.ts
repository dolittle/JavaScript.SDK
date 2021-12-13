// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

export * from './_exports';

export {
    CannotRegisterEmbeddingThatIsNotAClass,
    DeletionDecoratedMethod,
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
    EmbeddingsBuilder,
    EmbeddingsBuilderCallback,
    IEmbeddingBuilder,
    IEmbeddingBuilderForReadModel,
    IEmbeddingsBuilder,
    OnDecoratedEmbeddingMethod,
    ReadModelAlreadyDefinedForEmbedding,
    UpdateDecoratedMethod,
    embedding,
    getEmbeddingDecoratedType,
    on,
    getOnDecoratedMethods,
    resolveDeletionToEvents,
    getDeletionDecoratedMethod,
    resolveUpdateToEvents,
    getUpdateDecoratedMethod,
} from './Builders/_exports';

export {
    EmbeddingStore,
    FailedToGetEmbedding,
    FailedToGetEmbeddingKeys,
    FailedToGetEmbeddingState,
    IEmbeddingStore,
} from './Store/_exports';

export {
    EmbeddingStoreBuilder,
} from './Store/Builders/_exports';
