// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

export { IEmbedding } from './IEmbedding';
export { IEmbeddings } from './IEmbeddings';
export { Embeddings } from './Embeddings';
export { Embedding } from './Embedding';
export { EmbeddingCompareCallback } from './EmbeddingCompareCallback';
export { EmbeddingDeleteCallback } from './EmbeddingDeleteCallback';
export { EmbeddingContext } from './EmbeddingContext';
export { EmbeddingId } from './EmbeddingId';
export { MissingEmbeddingInformation } from './MissingEmbeddingInformation';

export * as internal from './Internal';

export {
    CannotRegisterEmbeddingThatIsNotAClass,
    ICanBuildAndRegisterAnEmbedding,
    compare,
    EmbeddingBuilder,
    EmbeddingBuilderForReadModel,
    EmbeddingClassBuilder,
    EmbeddingDecoratedType,
    EmbeddingDecoratedTypes,
    embedding,
    EmbeddingsBuilder,
    EmbeddingsBuilderCallback,
    ReadModelAlreadyDefinedForEmbedding,
} from './Builder';

// export {
//     CurrentState,
//     CurrentStateType,
//     FailedToGetEmbedding,
//     FailedToGetEmbeddingState,
//     IEmbeddingAssociations,
//     IEmbeddingStore,
//     NoEmbeddingAssociatedWithType,
//     NoTypeAssociatedWithEmbedding,
//     EmbeddingAssociation,
//     EmbeddingAssociations,
//     EmbeddingStore,
//     TypeIsNotAEmbedding,
//     EmbeddingStoreBuilder,
//     IConvertEmbeddingsToSDK,
//     EmbeddingsToSDKConverter,
//     UnknownCurrentStateType
// } from './Store';
