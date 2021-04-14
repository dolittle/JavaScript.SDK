// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { EventType, EventTypeId, EventTypeMap, Generation, IEventTypes } from '@dolittle/sdk.events';
import { Constructor } from '@dolittle/types';
import { DeleteReadModelInstance, KeySelector, OnDecoratedMethod, OnDecoratedMethods, ProjectionCallback } from '..';

/**
 * Defines a class for building and getting the decorated @on methods from class.
 */
export abstract class OnDecoratorResolver {

    protected tryAddAllOnMethods(events: EventTypeMap<[ProjectionCallback<any>, KeySelector]>, type: Constructor<any>, eventTypes: IEventTypes): boolean {
        let allMethodsValid = true;
        const methods = OnDecoratedMethods.methodsPerProjection.get(type);
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

            const onMethod = this.createProjectionMethod(method);
            const keySelector = method.keySelector;

            if (events.has(eventType!)) {
                allMethodsValid = false;
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
