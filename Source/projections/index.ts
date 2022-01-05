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
    CannotHaveMultipleScopedProjectionIdsAssociatedWithType,
    CannotHaveMultipleTypesAssociatedWithScopedProjectionId,
    CurrentState,
    CurrentStateType,
    FailedToGetProjection,
    FailedToGetProjectionState,
    IProjectionReadModelTypes,
    IProjectionStore,
    NoProjectionAssociatedWithType,
    ProjectionReadModelTypes,
    ProjectionStore,
    ScopedProjectionId,
    ScopedProjectionIdNotAssociatedToAType,
    TypeIsNotAProjection,
    TypeNotAssociatedToScopedProjectionId,
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
