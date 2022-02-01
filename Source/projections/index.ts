// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

export * from './_exports';

export {
    CouldNotCreateInstanceOfProjection,
    IProjectionBuilder,
    IProjectionBuilderForReadModel,
    IProjectionsBuilder,
    KeySelectorBuilder,
    KeySelectorBuilderCallback,
    OnDecoratedProjectionMethod,
    on,
    getOnDecoratedMethods,
    OnMethodSpecification,
    ProjectionBuilder,
    ProjectionBuilderForReadModel,
    ProjectionClassBuilder,
    ProjectionClassOnMethod,
    ProjectionDecoratedType,
    projection,
    isDecoratedProjectionType,
    getDecoratedProjectionType,
    ProjectionOptions,
    ProjectionsBuilder,
    ProjectionsBuilderCallback,
    ProjectionsModelBuilder,
    ReadModelAlreadyDefinedForProjection,
    TypeOrEventType,
} from './Builders/_exports';

export {
    ProjectionField,
    ProjectionFieldLike,
    isProjectionField,
} from './Copies/_exports';

export {
    CollectionName as MongoDBCollectionName,
    CollectionNameLike as MongoDBCollectionNameLike,
    isCollectionName as isMongoDBCollectionName,
    Conversion as MongoDBConversion,
} from './Copies/MongoDB/_exports';

export {
    CurrentState,
    CurrentStateType,
    FailedToGetProjection,
    FailedToGetProjectionState,
    IProjectionReadModelTypes,
    IProjectionStore,
    IProjectionOf,
    ProjectionReadModelTypes,
    ProjectionStore,
    ProjectionOf,
    ReceivedDuplicateProjectionKeys,
    ScopedProjectionId,
    TypeIsNotAProjection,
} from './Store/_exports';

export {
    ProjectionStoreBuilder,
    IProjectionStoreBuilder,
} from './Store/Builders/_exports';

export {
    IConvertProjectionsToSDK,
    ProjectionsToSDKConverter,
    UnknownCurrentStateType,
} from './Store/Converters/_exports';
