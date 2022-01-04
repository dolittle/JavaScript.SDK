// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IModel } from '@dolittle/sdk.common';

import { isEventType } from '../EventType';
import { EventTypes } from '../EventTypes';
import { IEventTypes } from '../IEventTypes';

/**
 * Represents a builder that can build {@link IEventTypes} from an {@link IModel}.
 */
export class EventTypesModelBuilder {
    /**
     * Builds an {@link IEventTypes} from the associated and registered event types.
     * @param {IModel} model - The built application model.
     * @returns {IEventTypes} The built event types.
     */
    build(model: IModel): IEventTypes {
        const bindings = model.getTypeBindings(isEventType);
        const eventTypes = new EventTypes();
        for (const { identifier, type } of bindings) {
            eventTypes.associate(type, identifier);
        }
        return eventTypes;
    }
}
