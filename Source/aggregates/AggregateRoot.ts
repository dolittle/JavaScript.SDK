// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import {
    AggregateRootId,
    AggregateRootVersion,
    AggregateRootVersionIsOutOfOrder,
    CommittedAggregateEvent,
    CommittedAggregateEvents,
    EventContentNeedsToBeDefined,
    EventSourceId,
    EventType,
    EventWasAppliedByOtherAggregateRoot,
    EventWasAppliedToOtherEventSource
} from '@dolittle/sdk.events';
import { AggregateRootIdentifierNotSet } from './AggregateRootIdentifierNotSet';
import { AppliedEvent } from './AppliedEvent';

/**
 * Represents the aggregate root
 */
export class AggregateRoot {
    private _aggregateRootId?: AggregateRootId;
    private _appliedEvents: AppliedEvent[] = [];
    private _version: AggregateRootVersion = AggregateRootVersion.initial;

    constructor(readonly eventSourceId: EventSourceId) {
    }

    /**
     * Gets aggregate root id
     */
    get aggregateRootId(): AggregateRootId {
        if (!this.aggregateRootId) {
            throw new AggregateRootIdentifierNotSet();
        }
        return this._aggregateRootId!;
    }

    /**
     * Sets the aggregate root id - internal use
     * @internal
     */
    set aggregateRootId(value: AggregateRootId) {
        this._aggregateRootId = value;
    }

    /**
     * Gets the version of the aggregate root
     * @returns {AggregateRootVersion}
     */
    get version(): AggregateRootVersion {
        return this._version;
    }

    /**
     * Gets all applied events
     * @returns {AppliedEvent[]}
     */
    get appliedEvents(): AppliedEvent[] {
        return this._appliedEvents;
    }

    /**
     * Apply an event to the aggregate root that will be committed to the event store
     * @param {*} event Event type apply.
     * @param {EventType} [eventType] Optional type of event to apply.
     */
    apply(event: any, eventType?: EventType): void {
        eventType = eventType || EventType.unspecified;
        this.applyImplementation(event, eventType, false);
    }

    /**
     * Apply a public event to the aggregate root that will be committed to the event store
     * @param {*} event Event type apply.
     * @param {EventType} [eventType] Optional type of event to apply.
     */
    applyPublic(event: any, eventType?: EventType): void {
        eventType = eventType || EventType.unspecified;
        this.applyImplementation(event, eventType, false);
    }

    /**
     * Re apply events from the event store
     * @param {CommittedAggregateEvents} events Events to re apply.
     */
    reApply(events: CommittedAggregateEvents) {
        this.throwIfEventWasAppliedToOtherEventSource(events);
        this.throwIfEventWasAppliedByOtherAggreateRoot(events);

        for (const event of events) {
            this.throwIfAggregateRootVersionIsOutOfOrder(event);
            this._version = this._version.next();
            if (!this.isStateLess) {
                this.invokeOnMethod(event);
            }
        }
    }

    /**
     * Gets whether aggregate root is stateless or not.
     */
    get isStateLess() {
        return true;
    }

    private invokeOnMethod(event: CommittedAggregateEvent) {

    }

    private applyImplementation(event: any, eventType: EventType, isPublic: boolean) {
        this.throwIfEventContentIsNullOrUndefined(event);
        this._appliedEvents.push(new AppliedEvent(event, eventType, isPublic));

        this._version = this._version.next();
    }

    private throwIfEventContentIsNullOrUndefined(event: any) {
        if (!event) {
            throw new EventContentNeedsToBeDefined();
        }
    }

    private throwIfAggregateRootVersionIsOutOfOrder(event: CommittedAggregateEvent) {
        if (event.aggregateRootVersion.value !== this.version.value) {
            throw new AggregateRootVersionIsOutOfOrder(event.aggregateRootVersion, this.version);
        }
    }

    private throwIfEventWasAppliedByOtherAggreateRoot(event: CommittedAggregateEvents) {
        if (!event.aggregateRootId.equals(this.aggregateRootId)) {
            throw new EventWasAppliedByOtherAggregateRoot(event.aggregateRootId, this.aggregateRootId);
        }
    }

    private throwIfEventWasAppliedToOtherEventSource(event: CommittedAggregateEvents) {
        if (!event.eventSourceId.equals(this.eventSourceId)) {
            throw new EventWasAppliedToOtherEventSource(event.eventSourceId, this.eventSourceId);
        }
    }
}
