// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { describeThis } from '@dolittle/typescript.testing';

import { EventSourceId } from '@dolittle/sdk.events';

import { AnAggregateRoot } from "./given/an_aggregate_root";
import { event_types, EventWithOnMethod, EventWithoutOnMethod } from "./given/events";


describeThis(__filename, () => {
    let event_source: EventSourceId;
    let aggregate_root: AnAggregateRoot;
    let first_event: EventWithOnMethod;
    let second_event: EventWithoutOnMethod;

    beforeEach(() => {
        event_source = EventSourceId.from('f77f4484-e683-4971-9b90-4cbfafbd21f2');
        aggregate_root = new AnAggregateRoot(event_source);
        aggregate_root.eventTypes = event_types();

        first_event = new EventWithOnMethod(1337);
        second_event = new EventWithoutOnMethod('hello world');
    });

    beforeEach(() => aggregate_root.applyBoth(first_event, second_event));

    it('should have applied two events', () => aggregate_root.appliedEvents.should.have.length(2));
    it('should have applied the correct first event', () => aggregate_root.appliedEvents[0].event.should.equal(first_event));
    it('should have applied the correct second event', () => aggregate_root.appliedEvents[1].event.should.equal(second_event));
    it('should not apply the first event as public', () => aggregate_root.appliedEvents[0].isPublic.should.be.false);
    it('should not apply the second event as public', () => aggregate_root.appliedEvents[1].isPublic.should.be.false);
    it('should have called an on-method', () => aggregate_root.onMethodEventsCalled.should.have.length(1));
    it('should call the on-method with the correct event', () => aggregate_root.onMethodEventsCalled[0].should.equal(first_event));
});
