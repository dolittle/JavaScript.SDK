// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';
import { DateTime } from 'luxon';

import { IEventTypes } from '@dolittle/sdk.artifacts';
import { EventContext, EventSourceId } from '@dolittle/sdk.events';
import { EventProcessor, MissingEventInformation } from '@dolittle/sdk.events.processing';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { guids, eventTypes } from '@dolittle/sdk.protobuf';

import { Failure } from '@dolittle/runtime.contracts/Fundamentals/Protobuf/Failure_pb';
import { FilterEventRequest, FilterRegistrationResponse } from '@dolittle/runtime.contracts/Runtime/Events.Processing/Filters_pb';
import { RetryProcessingState } from '@dolittle/runtime.contracts/Runtime/Events.Processing/Processors_pb';

import { FilterId } from '../index';

export abstract class FilterEventProcessor<TRegisterArguments, TResponse> extends EventProcessor<FilterId, TRegisterArguments, FilterRegistrationResponse, FilterEventRequest, TResponse> {

    constructor(
        kind: string,
        filterId: FilterId,
        private _eventTypes: IEventTypes,
        logger: Logger
    ) {
        super(kind, filterId, logger);
    }

    protected getFailureFromRegisterResponse(response: FilterRegistrationResponse): Failure | undefined {
        return response.getFailure();
    }

    protected getRetryProcessingStateFromRequest(request: FilterEventRequest): RetryProcessingState | undefined {
        return request.getRetryprocessingstate();
    }

    protected async handle(request: FilterEventRequest, executionContext: ExecutionContext): Promise<TResponse> {
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

        const pbArtifact = pbEvent.getType();
        if (!pbArtifact) throw new MissingEventInformation('Artifact');

        const eventContext = new EventContext(
            pbSequenceNumber,
            EventSourceId.from(guids.toSDK(pbEventSourceId)),
            DateTime.fromJSDate(pbOccurred.toDate()),
            executionContext);

        let event = JSON.parse(pbEvent.getContent());

        const artifact = eventTypes.toSDK(pbArtifact);
        if (this._eventTypes.hasTypeFor(artifact)) {
            const eventType = this._eventTypes.getTypeFor(artifact);
            event = Object.assign(new eventType(), event);
        }

        return this.filter(event, eventContext);
    }

    protected abstract filter (event: any, context: EventContext): Promise<TResponse>;
}
