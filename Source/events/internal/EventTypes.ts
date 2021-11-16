// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EventTypesClient } from '@dolittle/runtime.contracts/Events/EventTypes_grpc_pb';
import { EventTypeRegistrationRequest } from '@dolittle/runtime.contracts/Events/EventTypes_pb';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { artifacts, callContexts } from '@dolittle/sdk.protobuf';
import { Cancellation } from '@dolittle/sdk.resilience';
import { reactiveUnary } from '@dolittle/sdk.services';
import { Logger } from 'winston';
import { EventType, IEventTypes } from '../index';

/**
 * Represents a system that knows how to register Event Types with the Runtime.
 */
export class EventTypes {

    /**
     * Initializes an instance of the {@link EventTypes} class.
     * @param _client - The event types client.
     * @param _executionContext - The execution context.
     * @param _logger - The logger.
     */
    constructor(readonly _client: EventTypesClient, readonly _executionContext: ExecutionContext, readonly _logger: Logger) {
    }

    /**
     * Registers event types.
     * @param eventTypes - The event types to register.
     * @param cancellation - The cancellation.
     */
    register(eventTypes: EventType[], cancellation: Cancellation): Promise<any> {
        return Promise.all(eventTypes.map(eventType => this.sendRequest(eventType, cancellation)));
    }

    private createRequest(eventType: EventType): EventTypeRegistrationRequest {
        const result = new EventTypeRegistrationRequest();
        result.setEventtype(artifacts.toProtobuf(eventType));
        result.setCallcontext(callContexts.toProtobuf(this._executionContext));
        if (eventType.hasAlias()) {
            result.setAlias(eventType.alias!.value);
        }
        return result;
    }

    private async sendRequest(eventType: EventType, cancellation: Cancellation): Promise<any> {
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
