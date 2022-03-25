// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { ExecutionContext } from '@dolittle/sdk.execution';
import { Artifacts, ExecutionContexts } from '@dolittle/sdk.protobuf';
import { Cancellation } from '@dolittle/sdk.resilience';
import { reactiveUnary } from '@dolittle/sdk.services';

import { EventTypesClient } from '@dolittle/contracts/Runtime/Events/EventTypes_grpc_pb';
import { EventTypeRegistrationRequest } from '@dolittle/contracts/Runtime/Events/EventTypes_pb';

import { EventType } from '../EventType';
import { IEventTypes } from '../IEventTypes';

/**
 * Represents a system that knows how to register Event Types with the Runtime.
 */
export class EventTypes {

    /**
     * Initializes an instance of the {@link EventTypes} class.
     * @param {EventTypesClient} _client - The event types client.
     * @param {ExecutionContext} _executionContext - The execution context.
     * @param {Logger} _logger - The logger.
     */
    constructor(readonly _client: EventTypesClient, readonly _executionContext: ExecutionContext, readonly _logger: Logger) {
    }

    /**
     * Registers all event types from the given {@link IEventTypes}.
     * @param {IEventTypes} eventTypes - The event types to register.
     * @param {Cancellation} cancellation - The cancellation.
     * @returns {Promise<void>} A {@link Promise} that represents the asynchronous operation.
     */
    registerAllFrom(eventTypes: IEventTypes, cancellation: Cancellation): Promise<void> {
        const responses = eventTypes.getAll().map(_ => this.sendRequest(_, cancellation));
        return Promise.all(responses) as unknown as Promise<void>;
    }

    private createRequest(eventType: EventType): EventTypeRegistrationRequest {
        const result = new EventTypeRegistrationRequest();
        result.setEventtype(Artifacts.toProtobuf(eventType));
        result.setCallcontext(ExecutionContexts.toCallContext(this._executionContext));
        if (eventType.hasAlias()) {
            result.setAlias(eventType.alias!.value);
        }
        return result;
    }

    private async sendRequest(eventType: EventType, cancellation: Cancellation): Promise<void> {
        const request = this.createRequest(eventType);
        this._logger.debug(`Registering Event Type ${eventType.id.value.toString()} with Alias ${eventType.alias?.value}`);
        try {
            const response = await reactiveUnary(this._client, this._client.register, request, cancellation).toPromise();
            if (response.hasFailure()) {
                this._logger.warn(`An error occurred while registering Event Type ${eventType.id.value.toString()} with Alias ${eventType.alias?.value} because ${response.getFailure()?.getReason()}`);
            }
        } catch (err) {
            this._logger.warn(`An error occurred while registering Event Type ${eventType.id.value.toString()} with Alias ${eventType.alias?.value}. Error ${err}`);
        }
    }
}
