// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import { EventType } from './EventType';
import { EventTypeId } from './EventTypeId';
import { EventTypeMap } from './EventTypeMap';
import { IEventTypes } from './IEventTypes';

/**
 * Represents an implementation of {@link IEventTypes}.
 */
export class EventTypes extends IEventTypes {
    /**
     * Initialises a new instance of the {@link EventTypes} class.
     */
    constructor() {
        super(new EventTypeMap());
    }

    /** @inheritdoc */
    protected createArtifact(id: string | EventTypeId | Guid): EventType {
        return new EventType(EventTypeId.from(id));
    }

    /** @inheritdoc */
    protected getArtifactTypeName(): string {
        return 'EventType';
    }
}
