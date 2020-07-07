// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { forkJoin } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { EventDecoratedMethods } from '@dolittle/sdk.events';
import { IEventHandlers } from './IEventHandlers';
import { EventHandlerId } from './EventHandlerId';
import { EventHandlerSignature } from './EventHandlerMethod';
import { EventHandlerProvider, EventHandler } from './EventHandler';
import { EventHandlerDecoratedTypes } from './EventHandlerDecoratedTypes';
import { EventDecoratedMethod } from '@dolittle/sdk.events/EventDecoratedMethod';
import { EventHandlerDecoratedType } from './EventHandlerDecoratedType';

import { EventHandlersClient } from '@dolittle/runtime.contracts/Runtime/Events.Processing/EventHandlers_grpc_pb';

/**
 * Represents an implementation of {IEventHandlers}.
 */
export class EventHandlers implements IEventHandlers {

    constructor(readonly eventHandlersClient: EventHandlersClient) {
        const handleMethods = EventDecoratedMethods.methods.pipe(
            filter(_ => _.method.name === 'handle'),
        );

        forkJoin([handleMethods, EventHandlerDecoratedTypes.types]).pipe(
            filter((value: [EventDecoratedMethod, EventHandlerDecoratedType]) => value[0].owner === value[1].type),
            map((value: [EventDecoratedMethod, EventHandlerDecoratedType]) => new EventHandler(value[1].eventHandlerId, () => { return {}; }, []))
        );
    }


    /** @inheritdoc */
    register(eventHandlerProvider: EventHandlerProvider, eventType: Function, method: EventHandlerSignature, eventHandlerId?: EventHandlerId): void {
        throw new Error('Method not implemented.');
    }
}
