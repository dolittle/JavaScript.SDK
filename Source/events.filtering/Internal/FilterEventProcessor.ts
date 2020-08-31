// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';
import { DateTime } from 'luxon';

import { IArtifacts } from '@dolittle/sdk.artifacts';
import { EventContext, EventSourceId } from '@dolittle/sdk.events';
import { EventProcessor } from '@dolittle/sdk.events.processing';
import { MissingEventInformation } from '@dolittle/sdk.events.handling';
import { guids, executionContexts, artifacts } from '@dolittle/sdk.protobuf';

import { Failure } from '@dolittle/runtime.contracts/Fundamentals/Protobuf/Failure_pb';
import { FilterEventRequest, FilterRegistrationResponse } from '@dolittle/runtime.contracts/Runtime/Events.Processing/Filters_pb';
import { RetryProcessingState } from '@dolittle/runtime.contracts/Runtime/Events.Processing/Processors_pb';

import { FilterId } from '../index';

export abstract class FilterEventProcessor<TRegisterArguments, TResponse> extends EventProcessor<FilterId, TRegisterArguments, FilterRegistrationResponse, FilterEventRequest, TResponse> {

    constructor(
        kind: string,
        filterId: FilterId,
        private _artifacts: IArtifacts,
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

    protected async handle(request: FilterEventRequest): Promise<TResponse> {
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
            executionContexts.toSDK(pbExecutionContext)
        );

        let event = JSON.parse(pbEvent.getContent());

        const artifact = artifacts.toSDK(pbArtifact);
        if (this._artifacts.hasTypeFor(artifact)) {
            const eventType = this._artifacts.getTypeFor(artifact);
            event = Object.assign(new eventType(), event);
        }

        return this.filter(event, eventContext);
    }

    protected abstract filter (event: any, context: EventContext): Promise<TResponse>;
}
