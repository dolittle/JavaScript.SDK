// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';
import { DateTime } from 'luxon';

import { IServiceProvider } from '@dolittle/sdk.common';
import { EventContext, IEventTypes, EventSourceId, EventType } from '@dolittle/sdk.events';
import { MissingEventInformation, internal } from '@dolittle/sdk.events.processing';
import { ExecutionContext } from '@dolittle/sdk.execution';

import { Failure } from '@dolittle/contracts/Protobuf/Failure_pb';
import { FiltersClient } from '@dolittle/runtime.contracts/Events.Processing/Filters_grpc_pb';
import { FilterEventRequest, FilterRegistrationResponse } from '@dolittle/runtime.contracts/Events.Processing/Filters_pb';
import { RetryProcessingState } from '@dolittle/runtime.contracts/Events.Processing/Processors_pb';

import { FilterId } from '../FilterId';

import '@dolittle/sdk.protobuf';

/**
 * Represents an implementation of {@link internal.EventProcessor} that filters events to a stream.
 */
export abstract class FilterEventProcessor<TRegisterArguments, TResponse> extends internal.EventProcessor<FilterId, FiltersClient, TRegisterArguments, FilterRegistrationResponse, FilterEventRequest, TResponse> {

    /**
     * Initialises a new instance of the {@link FilterEventProcessor} class.
     * @param {string} kind - The kind of the filter.
     * @param {FilterId} filterId - The unique identifier of the filter.
     * @param {IEventTypes} _eventTypes - All registered event types.
     */
    constructor(
        kind: string,
        filterId: FilterId,
        private _eventTypes: IEventTypes
    ) {
        super(kind, filterId);
    }

    /** @inheritdoc */
    protected getFailureFromRegisterResponse(response: FilterRegistrationResponse): Failure | undefined {
        return response.getFailure();
    }

    /** @inheritdoc */
    protected getRetryProcessingStateFromRequest(request: FilterEventRequest): RetryProcessingState | undefined {
        return request.getRetryprocessingstate();
    }

    /** @inheritdoc */
    protected async handle(request: FilterEventRequest, executionContext: ExecutionContext, services: IServiceProvider, logger: Logger): Promise<TResponse> {
        if (!request.getEvent()) {
            throw new MissingEventInformation('no event in FilterEventRequest');
        }

        const pbEvent = request.getEvent()!;

        const pbSequenceNumber = pbEvent.getEventlogsequencenumber();
        if (pbSequenceNumber === undefined) throw new MissingEventInformation('Sequence Number');

        const pbEventSourceId = pbEvent.getEventsourceid();
        if (!pbEventSourceId) throw new MissingEventInformation('EventSourceId');

        const pbExecutionContext = pbEvent.getExecutioncontext();
        if (!pbExecutionContext) throw new MissingEventInformation('Execution context');

        const pbOccurred = pbEvent.getOccurred();
        if (!pbOccurred) throw new MissingEventInformation('Occurred');

        const pbEventType = pbEvent.getEventtype();
        if (!pbEventType) throw new MissingEventInformation('Event Type');

        const eventContext = new EventContext(
            pbSequenceNumber,
            EventSourceId.from(pbEventSourceId),
            DateTime.fromJSDate(pbOccurred.toDate()),
            executionContext);

        let event = JSON.parse(pbEvent.getContent());

        const eventTypeArtifact = pbEventType.toSDK(EventType.from);
        if (this._eventTypes.hasTypeFor(eventTypeArtifact)) {
            const eventType = this._eventTypes.getTypeFor(eventTypeArtifact);
            event = Object.assign(new eventType(), event);
        }

        return this.filter(event, eventContext, services, logger);
    }

    protected abstract filter(event: any, context: EventContext, services: IServiceProvider, logger: Logger): Promise<TResponse>;
}
