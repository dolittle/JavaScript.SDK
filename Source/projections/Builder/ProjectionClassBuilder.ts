// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { ProjectionsClient } from '@dolittle/runtime.contracts/Events.Processing/Projections_grpc_pb';
import { IContainer } from '@dolittle/sdk.common';
import { EventType, EventTypeId, EventTypeMap, Generation, IEventTypes } from '@dolittle/sdk.events';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { Cancellation } from '@dolittle/sdk.resilience';
import { Constructor } from '@dolittle/types';
import { Logger } from 'winston';
import { DeleteReadModelInstance, IProjections, KeySelector, Projection, ProjectionCallback } from '..';
import { ProjectionProcessor } from '../Internal';
import { CannotRegisterProjectionThatIsNotAClass } from './CannotRegisterProjectionThatIsNotAClass';
import { ICanBuildAndRegisterAProjection } from './ICanBuildAndRegisterAProjection';
import { OnDecoratedMethod } from './OnDecoratedMethod';
import { OnDecoratedMethods } from './OnDecoratedMethods';
import { on as onDecorator } from './onDecorator';
import { ProjectionDecoratedTypes } from './ProjectionDecoratedTypes';
import { projection as projectionDecorator } from './projectionDecorator';


export class ProjectionClassBuilder<T> extends ICanBuildAndRegisterAProjection {
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

        const methods = OnDecoratedMethods.methodsPerProjection.get(this._projectionType);
        if (methods === undefined) {
            logger.warn(`There are no on methods specified in projection ${this._projectionType.name}. An projection must to be decorated with @${onDecorator.name}`);
            return;
        }
        const events = new EventTypeMap<[ProjectionCallback<T>, KeySelector]>();
        if (!this.tryAddAllProjectionMethods(events, methods, eventTypes, logger)) {
            logger.warn(`Could not create projection ${this._projectionType.name} because it contains invalid projection methods`);
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



    private tryAddAllProjectionMethods(events: EventTypeMap<[ProjectionCallback<any>, KeySelector]>, methods: OnDecoratedMethod[], eventTypes: IEventTypes, logger: Logger): boolean {
        let allMethodsValid = true;
        for (const method of methods) {
            const [hasEventType, eventType] = this.tryGetEventTypeFromMethod(method, eventTypes);

            if (!hasEventType) {
                allMethodsValid = false;
                logger.warn(`Could not create projection method ${method.name} in projection ${this._projectionType.name} because it is not associated to an event type`);
                continue;
            }

            const onMethod = this.createProjectionMethod(method);
            const keySelector = method.keySelector;

            if (events.has(eventType!)) {
                allMethodsValid = false;
                logger.warn(`Event handler ${this._projectionType.name} has multiple projection methods handling event type ${eventType}`);
                continue;
            }
            events.set(eventType!, [onMethod, keySelector]);
        }
        return allMethodsValid;
    }

    private createProjectionMethod(method: OnDecoratedMethod): ProjectionCallback<any> {
        return (instance, event, projectionContext) => {
            const result = method.method.call(instance, event, projectionContext);
            if (result instanceof DeleteReadModelInstance) {
                return result;
            }
            return instance;
        };
    }

    private tryGetEventTypeFromMethod(method: OnDecoratedMethod, eventTypes: IEventTypes): [boolean, EventType | undefined] {
        if (this.eventTypeIsId(method.eventTypeOrId)) {
            return [
                true,
                new EventType(
                    EventTypeId.from(method.eventTypeOrId),
                    method.generation ? Generation.from(method.generation) : Generation.first)
            ];
        } else if (!eventTypes.hasFor(method.eventTypeOrId)) {
            return [false, undefined];
        } else {
            return [true, eventTypes.getFor(method.eventTypeOrId)];
        }
    }

    private eventTypeIsId(eventTypeOrId: Constructor<any> | EventTypeId | Guid | string): eventTypeOrId is EventTypeId | Guid | string {
        return eventTypeOrId instanceof EventTypeId || eventTypeOrId instanceof Guid || typeof eventTypeOrId === 'string';
    }
}
