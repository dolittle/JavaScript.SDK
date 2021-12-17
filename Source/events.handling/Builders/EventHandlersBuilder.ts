// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { IClientBuildResults, UniqueBindingBuilder } from '@dolittle/sdk.common';
import { IServiceProviderBuilder } from '@dolittle/sdk.dependencyinversion';
import { IEventTypes } from '@dolittle/sdk.events';

import { EventHandlerId } from '../EventHandlerId';
import { EventHandlerProcessor } from '../Internal/EventHandlerProcessor';
import { EventHandlerBuilder } from './EventHandlerBuilder';
import { EventHandlerBuilderCallback } from './EventHandlerBuilderCallback';
import { EventHandlerClassBuilder } from './EventHandlerClassBuilder';
import { eventHandler as eventHandlerDecorator, getDecoratedEventHandlerType } from './eventHandlerDecorator';
import { IEventHandlersBuilder } from './IEventHandlersBuilder';

const getBuilderName = (builder: EventHandlerBuilder | EventHandlerClassBuilder<any>): string => {
    if (builder instanceof EventHandlerBuilder) {
        return 'callback-handler';
    }
    return builder.type.name;
};

const getBuilderNames = (builders: (EventHandlerBuilder | EventHandlerClassBuilder<any>)[]): string => {
    return builders.map(getBuilderName).join(', ');
};

const compareBuilders = (left: EventHandlerBuilder | EventHandlerClassBuilder<any>, right: EventHandlerBuilder | EventHandlerClassBuilder<any>): boolean => {
    if (left instanceof EventHandlerClassBuilder && right instanceof EventHandlerClassBuilder) {
        return left.type === right.type;
    }
    return left === right;
};

/**
 * Represents an implementation of {@link IEventHandlersBuilder}.
 */
export class EventHandlersBuilder extends IEventHandlersBuilder {
    private readonly _builders = new UniqueBindingBuilder<EventHandlerId, EventHandlerBuilder | EventHandlerClassBuilder<any>>(
        (eventHandlerId, builder, count) => `The event handler id ${eventHandlerId} was bound to ${getBuilderName(builder)} ${count} times.`,
        (eventHandlerId, builders) => `The event handler id ${eventHandlerId} was used for multiple handlers (${getBuilderNames(builders)}). None of these will be registered.`,
        (builder, eventHandlerIds) => `The event handler ${getBuilderName(builder)} was bound to multiple event handler ids (${eventHandlerIds.join(', ')}). None of these will be registered.`,
        compareBuilders,
    );

    /**
     * Initialises a new instance of the {@link EventHandlersBuilder} class.
     * @param {IClientBuildResults} _buildResults - For keeping track of build results.
     */
    constructor(private readonly _buildResults: IClientBuildResults) {
        super();
    }

    /** @inheritdoc */
    createEventHandler(eventHandlerId: string | EventHandlerId | Guid, callback: EventHandlerBuilderCallback): IEventHandlersBuilder {
        const identifier = EventHandlerId.from(eventHandlerId);
        const builder = new EventHandlerBuilder(identifier);
        this._builders.add(identifier, builder);
        callback(builder);
        return this;
    }

    /** @inheritdoc */
    registerEventHandler<T = any>(type: Constructor<T>): IEventHandlersBuilder;
    registerEventHandler<T = any>(instance: T): IEventHandlersBuilder;
    registerEventHandler<T = any>(typeOrInstance: Constructor<T> | T): EventHandlersBuilder {
        const type = typeOrInstance instanceof Function ? typeOrInstance : Object.getPrototypeOf(typeOrInstance).constructor;
        const instance = typeOrInstance instanceof Function ? undefined : typeOrInstance;
        if (type === undefined) {
            this._buildResults.addFailure(`The event handler instance ${typeOrInstance} is not a class, it cannot be used as an event handler`);
            return this;
        }

        const eventHandlerType = getDecoratedEventHandlerType(type);
        if (eventHandlerType === undefined) {
            this._buildResults.addFailure(`The event handler class ${type.name} is not decorated as an event handler`,`Add the @${eventHandlerDecorator.name} decorator to the class`);
            return this;
        }

        const identifier = eventHandlerType.eventHandlerId;
        const builder = new EventHandlerClassBuilder(eventHandlerType, type, instance);
        this._builders.add(identifier, builder);
        return this;
    }

    /**
     * Builds all the event handlers.
     * @param {IEventTypes} eventTypes - All the registered event types.
     * @param {IServiceProviderBuilder} bindings - For registering the bindings for the event handler classes.
     * @returns {EventHandlerProcessor[]} The built event handlers.
     */
    build(
        eventTypes: IEventTypes,
        bindings: IServiceProviderBuilder
    ): EventHandlerProcessor[] {
        const uniqueBuilders = this._builders.buildUnique(this._buildResults);
        const processors: EventHandlerProcessor[] = [];

        for (const { value: builder } of uniqueBuilders) {
            const handler = builder.build(eventTypes, bindings, this._buildResults);
            if (handler !== undefined) {
                processors.push(new EventHandlerProcessor(handler, eventTypes));
            }
        }

        return processors;
    }
}
