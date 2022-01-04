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
     * Initialises a new instance of the {@link EventTypesModelBuilder} class.
     * @param {IModel} _model - The built application model.
     */
    constructor(
        private readonly _model: IModel,
    ) {}

    /**
     * Builds an {@link IEventTypes} from the associated and registered event types.
     * @returns {IEventTypes} The built event types.
     */
    build(): IEventTypes {
        const bindings = this._model.getTypeBindings(isEventType);
        const eventTypes = new EventTypes();
        for (const { identifier, type } of bindings) {
            eventTypes.associate(type, identifier);
        }
        return eventTypes;
    }
}
