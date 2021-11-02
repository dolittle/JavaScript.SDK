// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';
import { ArtifactOrId } from '@dolittle/sdk.artifacts';
import { CannotHaveMultipleEventTypesAssociatedWithType } from './CannotHaveMultipleEventTypesAssociatedWithType';
import { CannotHaveMultipleTypesAssociatedWithEventType } from './CannotHaveMultipleTypesAssociatedWithEventType';
import { EventType } from './EventType';
import { EventTypeId } from './EventTypeId';
import { EventTypeMap } from './EventTypeMap';
import { IEventTypes } from './IEventTypes';
import { UnableToResolveEventType } from './UnableToResolveEventType';
import { TypeNotAssociatedToEventType } from './TypeNotAssociatedToEventType';
import { EventTypeNotAssociatedToAType } from './EventTypeNotAssociatedToAType';

/**
 * Represents an implementation of {@link IEventTypes}
 */
export class EventTypes extends IEventTypes {
    /**
     * Initializes a new instance of {@link EventTypes}
     * @param {EventTypeMap<Constructor<any>>} [associations] Known associations
     */
    constructor(associations: EventTypeMap<Constructor<any>> = new EventTypeMap()) {
        super(associations);
    }
    /** @inheritdoc */
    protected createArtifact(artifactOrId: ArtifactOrId<EventType, EventTypeId>): EventType {
        return artifactOrId instanceof EventType
                ? artifactOrId
                : new EventType(EventTypeId.from(artifactOrId));
    }
    /** @inheritdoc */
    protected createNoArtifactAssociatedWithType(type: Constructor<any>): Exception {
        return new TypeNotAssociatedToEventType(type);
    }
    /** @inheritdoc */
    protected createNoTypeAssociatedWithArtifact(artifact: EventType): Exception {
        throw new EventTypeNotAssociatedToAType(artifact);
    }
    /** @inheritdoc */
    protected createUnableToResolveArtifact(object: any): Exception {
        throw new UnableToResolveEventType(object);
    }
    /** @inheritdoc */
    protected createCannotAssociateMultipleArtifactsWithType(type: Constructor<any>, artifact: EventType, existing: EventType): Exception {
        throw new CannotHaveMultipleEventTypesAssociatedWithType(type, artifact, existing);
    }
    /** @inheritdoc */
    protected createCannotAssociateMultipleTypesWithArtifact(artifact: EventType, type: Constructor<any>, existing: Constructor<any>): Exception {
        throw new CannotHaveMultipleTypesAssociatedWithEventType(artifact, type, existing);
    }
}
