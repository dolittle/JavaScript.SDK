// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

export {
    CannotRegisterProjectionThatIsNotAClass,
    CouldNotCreateInstanceOfProjection,
    ICanBuildAndRegisterAProjection,
    KeySelectorBuilder,
    KeySelectorBuilderCallback,
    on,
    OnDecoratedProjectionMethod,
    OnDecoratedProjectionMethods,
    projection,
    ProjectionBuilder,
    ProjectionBuilderForReadModel,
    ProjectionClassBuilder,
    ProjectionClassOnMethod,
    ProjectionDecoratedType,
    ProjectionDecoratedTypes,
    ProjectionOptions,
    ProjectionsBuilder,
    ProjectionsBuilderCallback,
    ReadModelAlreadyDefinedForProjection,
    TypeOrEventType,
    OnMethodSpecification
} from './Builder';
export { DeleteReadModelInstance } from './DeleteReadModelInstance';
export { EventPropertyKeySelector } from './EventPropertyKeySelector';
export { EventSelector } from './EventSelector';
export { EventSourceIdKeySelector } from './EventSourceIdKeySelector';
export * as internal from './Internal';
export { IProjection } from './IProjection';
export { IProjections } from './IProjections';
export { Key } from './Key';
export { KeySelector } from './KeySelector';
export { MissingOnMethodForType } from './MissingOnMethodForType';
export { PartitionIdKeySelector } from './PartitionIdKeySelector';
export { Projection } from './Projection';
export { ProjectionCallback } from './ProjectionCallback';
export { ProjectionContext } from './ProjectionContext';
export { ProjectionId } from './ProjectionId';
export { ProjectionResult } from './ProjectionResult';
export { Projections } from './Projections';
export {
    CurrentState,
    CurrentStateType,
    FailedToGetProjection,
    FailedToGetProjectionState,
    IConvertProjectionsToSDK,
    IProjectionAssociations,
    IProjectionStore,
    NoProjectionAssociatedWithType,
    NoTypeAssociatedWithProjection,
    ProjectionAssociation,
    ProjectionAssociations,
    ProjectionStore,
    ProjectionStoreBuilder,
    ProjectionsToSDKConverter,
    TypeIsNotAProjection,
    UnknownCurrentStateType,
    IProjectionStoreBuilder
} from './Store';
export { UnknownKeySelectorType } from './UnknownKeySelectorType';
