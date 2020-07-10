// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { forkJoin } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { EventDecoratedMethods } from '@dolittle/sdk.events';
import { IEventHandlers } from './IEventHandlers';
import { EventHandlerId } from './EventHandlerId';
import { EventHandlerSignature } from './EventHandlerMethod';
import { EventHandler } from './EventHandler';
import { EventHandlerDecoratedTypes } from './EventHandlerDecoratedTypes';
import { EventDecoratedMethod } from '@dolittle/sdk.events/EventDecoratedMethod';
import { EventHandlerDecoratedType } from './EventHandlerDecoratedType';

import { EventHandlersClient } from '@dolittle/runtime.contracts/Runtime/Events.Processing/EventHandlers_grpc_pb';
import { IEventHandler } from './IEventHandler';
import { ScopeId } from './ScopeId';
import { EventHandlerProcessor } from './Internal/EventHandlerProcessor';
import { IExecutionContextManager } from '@dolittle/sdk.execution';
import { IArtifacts } from '@dolittle/sdk.artifacts';
import { Logger } from 'winston';
import { Cancellation } from '@dolittle/sdk.services';

/**
 * Represents an implementation of {IEventHandlers}.
 */
export class EventHandlers implements IEventHandlers {

    constructor(
        private _eventHandlersClient: EventHandlersClient,
        private _executionContextManager: IExecutionContextManager,
        private _artifacts: IArtifacts,
        private _logger: Logger,
    ) {
        const handleMethods = EventDecoratedMethods.methods.pipe(
            filter(_ => _.method.name === 'handle'),
        );

        // forkJoin([handleMethods, EventHandlerDecoratedTypes.types]).pipe(
        //     filter((value: [EventDecoratedMethod, EventHandlerDecoratedType]) => value[0].owner === value[1].type),
        //     map((value: [EventDecoratedMethod, EventHandlerDecoratedType]) => new EventHandler(value[1].eventHandlerId, () => { return {}; }, []))
        // );
    }


    /** @inheritdoc */
    register(eventHandlerId: EventHandlerId, scopeId: ScopeId, partitioned: boolean, eventHandler: IEventHandler): void {
        new EventHandlerProcessor(
            eventHandlerId,
            scopeId,
            partitioned,
            eventHandler,
            this._eventHandlersClient,
            this._executionContextManager,
            this._artifacts,
            this._logger)
        .register(Cancellation.default).subscribe({
            error: (error: Error) => {
                console.log('Failed to register eventhandler', error);
            },
            complete: () => {
                console.log('EventHandler registration completed!');
            }
        });
    }
}
