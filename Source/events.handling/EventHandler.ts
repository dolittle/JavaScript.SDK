// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { IServiceProvider } from '@dolittle/sdk.common';
import { EventContext, EventType, EventTypeMap, ScopeId } from '@dolittle/sdk.events';

import { EventHandlerAlias } from './EventHandlerAlias';
import { EventHandlerId } from './EventHandlerId';
import { EventHandlerSignature } from './EventHandlerSignature';
import { IEventHandler } from './IEventHandler';
import { MissingEventHandlerForType } from './MissingEventHandlerForType';

/**
 * Represents an implementation of {@link IEventHandler}.
 */
export class EventHandler extends IEventHandler {
    readonly hasAlias: boolean;

    /**
     * Initializes a new instance of {@link EventHandler}.
     * @param {EventHandlerId} eventHandlerId - The unique identifier of the event handler.
     * @param {ScopeId} scopeId - The identifier of the scope the event handler is in.
     * @param {boolean} partitioned - Whether or not the event handler is partitioned.
     * @param {EventTypeMap<EventHandlerSignature<any>>} handleMethodsByEventType - Handle methods per event type.
     * @param {EventHandlerAlias | undefined} alias - The optional event handler alias.
     */
    constructor(
        readonly eventHandlerId: EventHandlerId,
        readonly scopeId: ScopeId,
        readonly partitioned: boolean,
        readonly handleMethodsByEventType: EventTypeMap<EventHandlerSignature<any>>,
        readonly alias: EventHandlerAlias | undefined = undefined
    ) {
        super();
        this.hasAlias = alias !== undefined;
    }

    /** @inheritdoc */
    get handledEvents(): Iterable<EventType> {
        return this.handleMethodsByEventType.keys();
    }

    /** @inheritdoc */
    async handle(event: any, eventType: EventType, context: EventContext, services: IServiceProvider, logger: Logger): Promise<void> {
        if (this.handleMethodsByEventType.has(eventType)) {
            const method = this.handleMethodsByEventType.get(eventType)!;
            await method(event, context, services, logger);
        } else {
            throw new MissingEventHandlerForType(eventType);
        }
    }
}
