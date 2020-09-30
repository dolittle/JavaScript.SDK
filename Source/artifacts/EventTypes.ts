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
     * Initializes a new instance of {@link Artifacts}
     * @param {Map<Function, Artifact>?} associations Known associations
     */
    constructor(private _associations: EventTypeMap = new EventTypeMap()) {
    }
    /** @inheritdoc */
    hasTypeFor(input: EventType): boolean {
        for (const associatedArtifact of this._associations.keys()) {
            if (this.eventTypesEquals(input, associatedArtifact)) return true;
        }
        return false;
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
        let artifact: EventType | undefined;
        for (const [associatedArtifact, associatedType] of this._associations) {
            if (associatedType === type) artifact = associatedArtifact;
        }
        if (!artifact) {
            throw new UnknownEventType(type);
        }
        return artifact;
    }

    /** @inheritdoc */
    resolveFrom(object: any, input?: EventType | EventTypeId | Guid | string): EventType {
        let artifact: EventType | undefined;
        if (input != null) {
            artifact = input instanceof EventType ? input : new EventType(EventTypeId.from(input));
        } else if (object && this.hasFor(object.constructor)) {
            artifact = this.getFor(object.constructor);
        }

        if (!artifact) {
            throw new UnableToResolveEventType(object, input);
        }

        return artifact;
    }

    /** @inheritdoc */
    associate(type: Constructor<any>, artifact: EventType): void {
        this.throwIfMultipleTypesAssociatedWithEventType(artifact, type);
        this.throwIfMultipleArtifactsAssociatedWithType(type, artifact);
        this._associations.set(artifact, type);
    }

    protected eventTypesEquals(left: EventType, right: EventType): boolean {
        return left.generation.equals(right.generation) && left.id.toString() === right.id.toString();
    }

    private throwIfMultipleArtifactsAssociatedWithType(type: Constructor<any>, eventType: EventType) {
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
