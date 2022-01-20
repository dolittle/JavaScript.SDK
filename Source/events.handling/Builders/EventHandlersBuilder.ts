// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { IClientBuildResults, IModelBuilder } from '@dolittle/sdk.common';

import { EventHandlerId } from '../EventHandlerId';
import { EventHandlerBuilder } from './EventHandlerBuilder';
import { EventHandlerClassBuilder } from './EventHandlerClassBuilder';
import { eventHandler as eventHandlerDecorator, isDecoratedEventHandlerType, getDecoratedEventHandlerType } from './eventHandlerDecorator';
import { IEventHandlersBuilder } from './IEventHandlersBuilder';
import { EventHandlerModelId } from '../EventHandlerModelId';
import { IEventHandlerBuilder } from './IEventHandlerBuilder';

/**
 * Represents an implementation of {@link IEventHandlersBuilder}.
 */
export class EventHandlersBuilder extends IEventHandlersBuilder {
    /**
     * Initialises a new instance of the {@link EventHandlersBuilder} class.
     * @param {IModelBuilder} _modelBuilder - For binding event handlers to identifiers.
     * @param {IClientBuildResults} _buildResults - For keeping track of build results.
     */
    constructor(
        private readonly _modelBuilder: IModelBuilder,
        private readonly _buildResults: IClientBuildResults
    ) {
        super();
    }

    /** @inheritdoc */
    create(eventHandlerId: string | EventHandlerId | Guid): IEventHandlerBuilder {
        const identifier = EventHandlerId.from(eventHandlerId);
        return new EventHandlerBuilder(identifier, this._modelBuilder);
    }

    /** @inheritdoc */
    register<T = any>(type: Constructor<T>): IEventHandlersBuilder;
    register<T = any>(instance: T): IEventHandlersBuilder;
    register<T = any>(typeOrInstance: Constructor<T> | T): IEventHandlersBuilder {
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
        const identifier = new EventHandlerModelId(eventHandlerType.eventHandlerId, eventHandlerType.scopeId);
        const builder = new EventHandlerClassBuilder(eventHandlerType, instance);
        this._modelBuilder.bindIdentifierToType(identifier, type);
        this._modelBuilder.bindIdentifierToProcessorBuilder(identifier, builder);
        return this;
    }
}
