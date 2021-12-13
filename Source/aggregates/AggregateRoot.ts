// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { AggregateRootId, AggregateRootVersion, AggregateRootVersionIsOutOfOrder, CommittedAggregateEvent, CommittedAggregateEvents, EventContentNeedsToBeDefined, EventSourceId, EventType, EventTypeId, EventWasAppliedByOtherAggregateRoot, EventWasAppliedToOtherEventSource, IEventTypes } from '@dolittle/sdk.events';

import { AggregateRootIdentifierNotSet } from './AggregateRootIdentifierNotSet';
import { AppliedEvent } from './AppliedEvent';
import { OnDecoratedMethod } from './OnDecoratedMethod';
import { EventTypesNotSet } from './EventTypesNotSet';
import { getOnDecoratedMethods } from './onDecorator';

/**
 * Represents the aggregate root.
 */
export class AggregateRoot {
    private _aggregateRootId?: AggregateRootId;
    private _aggregateRootType: Constructor<any>;
    private _appliedEvents: AppliedEvent[] = [];
    private _version: AggregateRootVersion = AggregateRootVersion.initial;
    private _eventTypes!: IEventTypes;

    /**
     * Initialises a new instance of the {@link AggregateRoot} class.
     * @param {EventSourceId} eventSourceId - The event source id of the aggregate root.
     */
    constructor(readonly eventSourceId: EventSourceId) {
        this._aggregateRootType = Object.getPrototypeOf(this).constructor;
    }

    /**
     * Gets aggregate root id.
     */
    get aggregateRootId(): AggregateRootId {
        if (!this._aggregateRootId) {
            throw new AggregateRootIdentifierNotSet();
        }
        return this._aggregateRootId!;
    }

    /**
     * Sets the aggregate root id - internal use.
     */
    set aggregateRootId(value: AggregateRootId) {
        this._aggregateRootId = value;
    }

    /**
     * Sets the event types - internal use.
     */
    set eventTypes(value: IEventTypes) {
        this._eventTypes = value;
    }

    /**
     * Gets the version of the aggregate root.
     */
    get version(): AggregateRootVersion {
        return this._version;
    }

    /**
     * Gets all applied events.
     */
    get appliedEvents(): AppliedEvent[] {
        return this._appliedEvents;
    }

    /**
     * Apply an event to the aggregate root that will be committed to the event store.
     * @param {any} event - Event type apply.
     * @param {EventType} [eventType] - Optional type of event to apply.
     */
    apply(event: any, eventType?: EventType): void {
        this.applyImplementation(event, eventType, false);
    }

    /**
     * Apply a public event to the aggregate root that will be committed to the event store.
     * @param {any} event - Event type apply.
     * @param {EventType} [eventType] - Optional type of event to apply.
     */
    applyPublic(event: any, eventType?: EventType): void {
        this.applyImplementation(event, eventType, true);
    }

    /**
     * Re-applies the committed aggregate events to rehydrate the state of the aggregate root by calling on()-methods and incrementing the in-memory version.
     * @param {CommittedAggregateEvents} committedEvents - The events to re-apply.
     */
    reApply(committedEvents: CommittedAggregateEvents) {
        this.throwIfEventWasAppliedToOtherEventSource(committedEvents);
        this.throwIfEventWasAppliedByOtherAggreateRoot(committedEvents);

        const hasState = getOnDecoratedMethods(this._aggregateRootType).length > 0;

        for (const event of committedEvents) {
            this.throwIfAggregateRootVersionIsOutOfOrder(event);
            this.nextVersion();
            if (hasState) {
                const onMethod = this.getOnMethodFor(event, event.type);

                if (onMethod) {
                    onMethod.method.call(this, event.content);
                }
            }
        }
    }

    /**
     * Move to next version.
     */
    nextVersion() {
        this._version = this._version.next();
    }

    private applyImplementation(event: any, eventType: EventType | undefined, isPublic: boolean) {
        this.throwIfEventContentIsNullOrUndefined(event);
        this._appliedEvents.push(new AppliedEvent(event, eventType, isPublic));
        this.nextVersion();
        this.invokeOnMethod(event, eventType);
    }

    private invokeOnMethod(event: any, eventType: EventType | undefined) {
        if (this._eventTypes === undefined) {
            throw new EventTypesNotSet();
        }
        const hasState = getOnDecoratedMethods(this._aggregateRootType).length > 0;
        if (!hasState) {
            return;
        }
        const onMethod = this.getOnMethodFor(event, eventType);
        if (onMethod) {
            onMethod.method.call(this, event.content);
        }
    }

    private throwIfEventContentIsNullOrUndefined(event: any) {
        if (!event) {
            throw new EventContentNeedsToBeDefined();
        }
    }

    private getOnMethodFor(event: any, eventType: EventType | undefined): OnDecoratedMethod | undefined {
        return getOnDecoratedMethods(this._aggregateRootType).find(_ => {
            let decoratorEventTypeId = EventTypeId.from(Guid.empty);
            if (_.eventTypeOrId instanceof Function) {
                decoratorEventTypeId = this._eventTypes.getFor(_.eventTypeOrId).id;
            } else {
                decoratorEventTypeId = EventTypeId.from(_.eventTypeOrId);
            }

            const appliedEventType = this._eventTypes.resolveFrom(event, eventType);

            return appliedEventType.id.equals(decoratorEventTypeId);
        });
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
