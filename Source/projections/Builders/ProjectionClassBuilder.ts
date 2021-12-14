// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { Generation } from '@dolittle/sdk.artifacts';
import { IClientBuildResults } from '@dolittle/sdk.common';
import { EventType, EventTypeId, EventTypeMap,  IEventTypes } from '@dolittle/sdk.events';

import { DeleteReadModelInstance } from '../DeleteReadModelInstance';
import { IProjection } from '../IProjection';
import { KeySelector } from '../KeySelector';
import { Projection } from '../Projection';
import { ProjectionCallback } from '../ProjectionCallback';
import { CannotRegisterProjectionThatIsNotAClass } from './CannotRegisterProjectionThatIsNotAClass';
import { OnDecoratedProjectionMethod } from './OnDecoratedProjectionMethod';
import { projection as projectionDecorator, getDecoratedProjectionType } from './projectionDecorator';
import { getOnDecoratedMethods } from './onDecorator';

/**
 * Represents a builder for building a projection from a class.
 * @template T The type of the projection class.
 */
export class ProjectionClassBuilder<T> {
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

    /**
     * Builds the projection.
     * @param {IEventTypes} eventTypes - For event types resolution.
     * @param {IClientBuildResults} results - For keeping track of build results.
     * @returns {IProjection | undefined} The built projection if successful.
     */
    build(eventTypes: IEventTypes, results: IClientBuildResults): IProjection<T> | undefined {

        results.addInformation(`Building projection of type ${this._projectionType.name}`);
        const decoratedType = getDecoratedProjectionType(this._projectionType);
        if (decoratedType === undefined) {
            results.addFailure(`The projection class ${this._projectionType.name} must be decorated with an @${projectionDecorator.name} decorator`);
            return;
        }

        results.addInformation(`Building projection ${decoratedType.projectionId} processing events in scope ${decoratedType.scopeId} from type ${this._projectionType.name}`);
        const events = new EventTypeMap<[ProjectionCallback<T>, KeySelector]>();
        if (!this.tryAddAllOnMethods(events, this._projectionType, eventTypes)) {
            results.addFailure(`Could not create projection ${this._projectionType.name} because it contains invalid projection methods`, 'Maybe you have multiple @on methods handling the same event type?');
            return;
        }
        return new Projection<T>(decoratedType.projectionId, decoratedType.type, decoratedType.scopeId, events);
    }

    private tryAddAllOnMethods(events: EventTypeMap<[ProjectionCallback<T>, KeySelector]>, type: Constructor<any>, eventTypes: IEventTypes): boolean {
        let allMethodsValid = true;
        const methods = getOnDecoratedMethods(type);
        if (methods.length < 1) {
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
