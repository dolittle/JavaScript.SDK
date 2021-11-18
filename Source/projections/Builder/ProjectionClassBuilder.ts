// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { ProjectionsClient } from '@dolittle/runtime.contracts/Events.Processing/Projections_grpc_pb';
import { Generation } from '@dolittle/sdk.artifacts';
import { IContainer } from '@dolittle/sdk.common';
import { EventType, EventTypeId, EventTypeMap,  IEventTypes } from '@dolittle/sdk.events';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { Cancellation } from '@dolittle/sdk.resilience';
import { Constructor } from '@dolittle/types';
import { Logger } from 'winston';
import { DeleteReadModelInstance, IProjections, KeySelector, Projection, ProjectionCallback } from '../index';
import { ProjectionProcessor } from '../Internal';
import { CannotRegisterProjectionThatIsNotAClass } from './CannotRegisterProjectionThatIsNotAClass';
import { ICanBuildAndRegisterAProjection } from './ICanBuildAndRegisterAProjection';
import { OnDecoratedProjectionMethod } from './OnDecoratedProjectionMethod';
import { OnDecoratedProjectionMethods } from './OnDecoratedProjectionMethods';
import { ProjectionDecoratedTypes } from './ProjectionDecoratedTypes';
import { projection as projectionDecorator } from './projectionDecorator';

/**
 * Represents an implementation of {@link ICanBuildAndRegisterAProjection} that build a projection from a class.
 * @template T The type of the projection class.
 */
export class ProjectionClassBuilder<T> implements ICanBuildAndRegisterAProjection {
    private readonly _projectionType: Constructor<T>;

    /**
     * Initialises a new instance of the {@link FailureReason} class.
     * @param {Constructor<T> | T} typeOrInstance - The type or instance of the class to build the projection from.
     */
    constructor(typeOrInstance: Constructor<T> | T) {
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

    private tryAddAllOnMethods(events: EventTypeMap<[ProjectionCallback<T>, KeySelector]>, type: Constructor<any>, eventTypes: IEventTypes): boolean {
        let allMethodsValid = true;
        const methods = OnDecoratedProjectionMethods.methodsPerProjection.get(type);
        if (methods === undefined) {
            allMethodsValid = false;
            return allMethodsValid;
        }

        for (const method of methods) {
            const [hasEventType, eventType] = this.tryGetEventTypeFromMethod(method, eventTypes);

            if (!hasEventType) {
                allMethodsValid = false;
                continue;
            }

            const onMethod = this.createOnMethod(method);
            const keySelector = method.keySelector;

            if (events.has(eventType!)) {
                allMethodsValid = false;
                continue;
            }
            events.set(eventType!, [onMethod, keySelector]);
        }
        return allMethodsValid;
    }

    private tryGetEventTypeFromMethod(method: OnDecoratedProjectionMethod, eventTypes: IEventTypes): [boolean, EventType | undefined] {
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

    private createOnMethod(method: OnDecoratedProjectionMethod): ProjectionCallback<T> {
        return async (instance, event, projectionContext) => {
            const result = await method.method.call(instance, event, projectionContext);
            if (result instanceof DeleteReadModelInstance) {
                return result;
            }
            return instance;
        };
    }
}
