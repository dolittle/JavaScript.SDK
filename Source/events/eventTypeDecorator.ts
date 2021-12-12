// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Generation } from '@dolittle/sdk.artifacts';
import { Decorators } from '@dolittle/sdk.common';
import { Constructor } from '@dolittle/types';
import { ClassNotDecoratedWithEventType } from './ClassNotDecoratedWithEventType';

import { EventType } from './EventType';
import { EventTypeAlias } from './EventTypeAlias';
import { EventTypeDecoratorAppliedMultipleTimes } from './EventTypeDecoratorAppliedMultipleTimes';
import { EventTypeId, EventTypeIdLike } from './EventTypeId';
import { EventTypeOptions } from './EventTypeOptions';

type Decorator = (target: any, propertyKey?: string | symbol, parameterIndex?: PropertyDescriptor | number) => void;

const [decorator, getMetadata] = Decorators.createMetadataDecorator<EventType>('event-type', 'eventType', Decorators.DecoratorTarget.Class);

/**
 * Decorator for associating a class with an event type.
 * @param {EventTypeIdLike} identifier - The event type to associate with this class.
 * @param {EventTypeOptions} [options={}] - Options to give to the event type.
 * @returns {Decorator} The decorator.
 */
export function eventType(identifier: EventTypeIdLike, options: EventTypeOptions = {}): Decorator {
    return decorator((target, type, propertyKey, index, value) => {
        if (value !== undefined) {
            throw new EventTypeDecoratorAppliedMultipleTimes(type.name);
        }

        return new EventType(
            EventTypeId.from(identifier),
            options.generation ? Generation.from(options.generation) : Generation.first,
            EventTypeAlias.from(options.alias ?? type.name));
    });
}

/**
 * Gets the decorated event type of the specified class.
 * @param {Constructor<any>} type - The class to get the decorated event type for.
 * @returns {EventType} The decorated event type.
 */
export function getDecoratedEventType(type: Constructor<any>): EventType {
    const decoratedEventType = getMetadata(type);

    if (decoratedEventType === undefined) {
        throw new ClassNotDecoratedWithEventType(type.name);
    }

    return decoratedEventType;
}
