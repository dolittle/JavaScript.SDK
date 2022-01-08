// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

export { DeletionDecoratedMethod } from './DeletionDecoratedMethod';
export { EmbeddingAlreadyHasADeletionDecorator } from './EmbeddingAlreadyHasADeletionDecorator';
export { EmbeddingAlreadyHasADeletionMethod } from './EmbeddingAlreadyHasADeletionMethod';
export { EmbeddingAlreadyHasAnUpdateDecorator } from './EmbeddingAlreadyHasAnUpdateDecorator';
export { EmbeddingAlreadyHasAnUpdateMethod } from './EmbeddingAlreadyHasAnUpdateMethod';
export { EmbeddingBuilder } from './EmbeddingBuilder';
export { EmbeddingBuilderForReadModel } from './EmbeddingBuilderForReadModel';
export { EmbeddingClassBuilder } from './EmbeddingClassBuilder';
export { EmbeddingClassDeletionMethod } from './EmbeddingClassDeletionMethod';
export { EmbeddingClassOnMethod } from './EmbeddingClassOnMethod';
export { EmbeddingClassUpdateMethod } from './EmbeddingClassUpdateMethod';
export { EmbeddingDecoratedType } from './EmbeddingDecoratedType';
export { EmbeddingsBuilder } from './EmbeddingsBuilder';
export { EmbeddingsBuilderCallback } from './EmbeddingsBuilderCallback';
export { EmbeddingsModelBuilder } from './EmbeddingsModelBuilder';
export { IEmbeddingBuilder } from './IEmbeddingBuilder';
export { IEmbeddingBuilderForReadModel } from './IEmbeddingBuilderForReadModel';
export { IEmbeddingsBuilder } from './IEmbeddingsBuilder';
export { OnDecoratedEmbeddingMethod } from './OnDecoratedEmbeddingMethod';
export { ReadModelAlreadyDefinedForEmbedding } from './ReadModelAlreadyDefinedForEmbedding';
export { UpdateDecoratedMethod } from './UpdateDecoratedMethod';
export { embedding, isDecoratedEmbeddingType, getDecoratedEmbeddingType } from './embeddingDecorator';
export { on, getOnDecoratedMethods } from './onDecorator';
export { resolveDeletionToEvents, getDeletionDecoratedMethod } from './resolveDeletionToEventsDecorator';
export { resolveUpdateToEvents, getUpdateDecoratedMethod } from './resolveUpdateToEventsDecorator';
