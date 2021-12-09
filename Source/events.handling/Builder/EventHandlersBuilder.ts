// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { IClientBuildResults } from '@dolittle/sdk.common/ClientSetup';
import { IEventTypes } from '@dolittle/sdk.events';
import { IContainer } from '@dolittle/sdk.common';

import { EventHandlerId, IEventHandler } from '..';
import { EventHandlerProcessor } from '../Internal';
import { EventHandlerBuilder } from './EventHandlerBuilder';
import { EventHandlerBuilderCallback } from './EventHandlerBuilderCallback';
import { EventHandlerClassBuilder } from './EventHandlerClassBuilder';
import { IEventHandlersBuilder } from './IEventHandlersBuilder';

/**
 * Represents an implementation of {@link IEventHandlersBuilder}.
 */
export class EventHandlersBuilder extends IEventHandlersBuilder {
    private _callbackBuilders: EventHandlerBuilder[] = [];
    private _classBuilders: EventHandlerClassBuilder<any>[] = [];

    /** @inheritdoc */
    createEventHandler(eventHandlerId: string | EventHandlerId | Guid, callback: EventHandlerBuilderCallback): IEventHandlersBuilder {
        const builder = new EventHandlerBuilder(EventHandlerId.from(eventHandlerId));
        callback(builder);
        this._callbackBuilders.push(builder);
        return this;
    }

    /** @inheritdoc */
    register<T = any>(type: Constructor<T>): IEventHandlersBuilder;
    register<T = any>(instance: T): IEventHandlersBuilder;
    register<T = any>(typeOrInstance: Constructor<T> | T): EventHandlersBuilder {
        this._classBuilders.push(new EventHandlerClassBuilder(typeOrInstance));
        return this;
    }

    /**
     * Builds all the event handlers.
     * @param {IContainer} container - The container to use to create new instances of event handler types.
     * @param {IEventTypes} eventTypes - All the registered event types.
     * @param {IClientBuildResults} results - For keeping track of build results.
     * @returns {EventHandlerProcessor[]} The built event handlers.
     */
    build(
        container: IContainer,
        eventTypes: IEventTypes,
        results: IClientBuildResults
    ): EventHandlerProcessor[] {
        const eventHandlers: IEventHandler[] = [];

        for (const eventHandlerBuilder of this._callbackBuilders) {
            const eventHandler = eventHandlerBuilder.build(eventTypes, results);
            if (eventHandler !== undefined) {
                eventHandlers.push(eventHandler);
            }
        }

        for (const eventHandlerBuilder of this._classBuilders) {
            const eventHandler = eventHandlerBuilder.build(container ,eventTypes, results);
            if (eventHandler !== undefined) {
                eventHandlers.push(eventHandler);
            }
        }

        return eventHandlers.map(handler =>
            new EventHandlerProcessor(handler, eventTypes));
    }
}
