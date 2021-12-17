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
import { eventHandler as eventHandlerDecorator, isDecoratedEventHandlerType, getDecoratedEventHandlerType } from './eventHandlerDecorator';
import { IEventHandlersBuilder } from './IEventHandlersBuilder';

type Builder = EventHandlerBuilder | EventHandlerClassBuilder<any>;

const getBuilderName = (builder: Builder): string => {
    if (builder instanceof EventHandlerBuilder) {
        return 'callback handler';
    }
    return builder.type.type.name;
};

const compareBuilders = (left: Builder, right: Builder): boolean => {
    if (left instanceof EventHandlerClassBuilder && right instanceof EventHandlerClassBuilder) {
        return left.type === right.type && left.instance === right.instance;
    }
    return left === right;
};

/**
 * Represents an implementation of {@link IEventHandlersBuilder}.
 */
export class EventHandlersBuilder extends IEventHandlersBuilder {
    private readonly _builders = new UniqueBindingBuilder<EventHandlerId, Builder>('event handler', getBuilderName, compareBuilders);

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
        this._builders.add(identifier, class {}, builder);
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

        if (!isDecoratedEventHandlerType(type)) {
            this._buildResults.addFailure(`The event handler class ${type.name} is not decorated as an event handler`,`Add the @${eventHandlerDecorator.name} decorator to the class`);
            return this;
        }

        const eventHandlerType = getDecoratedEventHandlerType(type);
        const identifier = eventHandlerType.eventHandlerId;
        const builder = new EventHandlerClassBuilder(eventHandlerType, instance);
        this._builders.add(identifier, type, builder);
        return this;
    }

    /**
     * Builds all the event handlers.
     * @param {IEventTypes} eventTypes - All the registered event types.
     * @param {IServiceProviderBuilder} bindings - For registering the bindings for the event handler classes.
     * @returns {EventHandlerProcessor[]} The built event handlers.
     */
    build(eventTypes: IEventTypes, bindings: IServiceProviderBuilder): EventHandlerProcessor[] {
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
