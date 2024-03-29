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
    ReadModelField,
    TypeOrEventType,
} from './Builders/_exports';

export {
    convertToMongoDB,
    getConvertToMongoDBDecoratedProperties,
    CopyProjectionToMongoDBDecoratedType,
    copyProjectionToMongoDB,
    isDecoratedCopyProjectionToMongoDB,
    getDecoratedCopyProjectionToMongoDB,
    CopyToMongoDBBuilder,
    CopyToMongoDBCallback,
    ICopyToMongoDBBuilder,
    MongoDBConversionDecoratedProperty,
} from './Builders/Copies/_exports';

export {
    ProjectionProperty,
    ProjectionPropertyLike,
    isProjectionProperty,
    ProjectionCopies,
} from './Copies/_exports';

export {
    CollectionName as MongoDBCollectionName,
    CollectionNameLike as MongoDBCollectionNameLike,
    isCollectionName as isMongoDBCollectionName,
    Conversion as MongoDBConversion,
    InvalidCollectionName,
    MongoDBCopies,
    PropertyConversion,
    UnknownMongoDBConversion,
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
