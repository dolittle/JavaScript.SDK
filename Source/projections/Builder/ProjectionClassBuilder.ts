// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { EventType, EventTypeId, EventTypeMap, Generation, IEventTypes } from '@dolittle/sdk.events';
import { Cancellation } from '@dolittle/sdk.resilience';
import { Guid } from '@dolittle/rudiments';
import { IContainer } from '@dolittle/sdk.common';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { Constructor } from '@dolittle/types';

import { ProjectionsClient } from '@dolittle/runtime.contracts/Events.Processing/Projections_grpc_pb';

import { IProjections, ProjectionCallback, Projection, KeySelector } from '..';
import { ProjectionProcessor } from '../Internal';

import { CannotRegisterProjectionThatIsNotAClass } from './CannotRegisterProjectionThatIsNotAClass';
import { ICanBuildAndRegisterAProjection } from './ICanBuildAndRegisterAProjection';
import { on as onDecorator } from './onDecorator';
import { OnDecoratedMethods } from './OnDecoratedMethods';
import { projection as projectionDecorator } from './projectionDecorator';
import { ProjectionDecoratedTypes } from './ProjectionDecoratedTypes';
import { OnDecoratorResolver } from './OnDecoratorResolver';

export class ProjectionClassBuilder<T> extends OnDecoratorResolver implements ICanBuildAndRegisterAProjection {
    private readonly _projectionType: Constructor<T>;

    constructor(typeOrInstance: Constructor<T> | T) {
        super();
        if (typeOrInstance instanceof Function) {
            this._projectionType = typeOrInstance;

        } else {
            this._projectionType = Object.getPrototypeOf(typeOrInstance).constructor;
            if (this._projectionType === undefined) {
                throw new CannotRegisterProjectionThatIsNotAClass(typeOrInstance);
            }
        }
    }

    /** @inheritdoc */
    buildAndRegister(
        client: ProjectionsClient,
        projections: IProjections,
        container: IContainer,
        executionContext: ExecutionContext,
        eventTypes: IEventTypes,
        logger: Logger,
        cancellation: Cancellation): void {

        logger.debug(`Building projection of type ${this._projectionType.name}`);
        const decoratedType = ProjectionDecoratedTypes.types.find(_ => _.type === this._projectionType);
        if (decoratedType === undefined) {
            logger.warn(`The projection class ${this._projectionType.name} must be decorated with an @${projectionDecorator.name} decorator`);
            return;
        }
        logger.debug(`Building projection ${decoratedType.projectionId} processing events in scope ${decoratedType.scopeId} from type ${this._projectionType.name}`);

        const events = new EventTypeMap<[ProjectionCallback<T>, KeySelector]>();
        if (!this.tryAddAllOnMethods(events, this._projectionType, eventTypes)) {
            logger.warn(`Could not create projection ${this._projectionType.name} because it contains invalid projection methods. Maybe you have multiple @on methods handling the same event type?`);
            return;
        }
        const projection = new Projection<T>(decoratedType.projectionId, decoratedType.type, decoratedType.scopeId, events);
        projections.register<T>(
            new ProjectionProcessor<T>(
                projection,
                client,
                executionContext,
                eventTypes,
                logger
            ), cancellation);
    }
}
