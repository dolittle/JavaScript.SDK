// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';
import { UnknownType } from './UnknownType';
import { EventTypeMap } from './EventTypeMap';
import { IEventTypes } from './IEventTypes';
import { EventType } from './EventType';
import { UnknownEventType } from './UnknownEventType';
import { EventTypeId } from './EventTypeId';
import { UnableToResolveEventType } from './UnableToResolveEventType';
import { CannotHaveMultipleEventTypesAssociatedWithType } from './CannotHaveMultipleEventTypesAssociatedWithType';
import { CannotHaveMultipleTypesAssociatedWithEventType } from './CannotHaveMultipleTypesAssociatedWithEventType';

/**
 * Represents an implementation of {@link IEventTypes}
 */
export class EventTypes implements IEventTypes {
    /**
     * Initializes a new instance of {@link EventTypes}
     * @param {EventTypeMap<Constructor<any>>} [associations] Known associations
     */
    constructor(private _associations: EventTypeMap<Constructor<any>> = new EventTypeMap()) {
    }
    /** @inheritdoc */
    hasTypeFor(input: EventType): boolean {
        return this._associations.has(input);
    }

    /** @inheritdoc */
    getTypeFor(input: EventType): Constructor<any> {
        const type = this._associations.get(input);
        if (!type) {
            throw new UnknownType(input);
        }
        return type;
    }


    /** @inheritdoc */
    hasFor(type: Constructor<any>): boolean {
        for (const associatedType of this._associations.values()) {
            if (associatedType === type) return true;
        }
        return false;
    }

    /** @inheritdoc */
    getFor(type: Constructor<any>): EventType {
        let eventType: EventType | undefined;
        for (const [associatedEventType, associatedType] of this._associations) {
            if (associatedType === type) eventType = associatedEventType;
        }
        if (!eventType) {
            throw new UnknownEventType(type);
        }
        return eventType;
    }

    /** @inheritdoc */
    resolveFrom(object: any, input?: EventType | EventTypeId | Guid | string): EventType {
        let eventType: EventType | undefined;
        if (input !== undefined) {
            eventType = input instanceof EventType ? input : new EventType(EventTypeId.from(input));
        } else if (object && this.hasFor(Object.getPrototypeOf(object).constructor)) {
            eventType = this.getFor(Object.getPrototypeOf(object).constructor);
        }

        if (!eventType) {
            throw new UnableToResolveEventType(object);
        }

        return eventType;
    }

    /** @inheritdoc */
    associate(type: Constructor<any>, eventType: EventType): void {
        this.throwIfMultipleTypesAssociatedWithEventType(eventType, type);
        this.throwIfMultipleEventTypesAssociatedWithType(type, eventType);
        this._associations.set(eventType, type);
    }

    protected eventTypesEquals(left: EventType, right: EventType): boolean {
        return left.generation.equals(right.generation) && left.id.toString() === right.id.toString();
    }

    private throwIfMultipleEventTypesAssociatedWithType(type: Constructor<any>, eventType: EventType) {
        if (this.hasFor(type)) {
            throw new CannotHaveMultipleEventTypesAssociatedWithType(type, eventType, this.getFor(type));
        }
    }
    private throwIfMultipleTypesAssociatedWithEventType(eventType: EventType, type: Constructor<any>) {
        if (this.hasTypeFor(eventType)) {
            throw new CannotHaveMultipleTypesAssociatedWithEventType(eventType, type, this.getTypeFor(eventType));
        }
    }
}
