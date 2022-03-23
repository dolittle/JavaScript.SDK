// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { describeThis } from '@dolittle/typescript.testing';

import { EventSourceId } from '@dolittle/sdk.events';

import { AnAggregateRoot } from './given/an_aggregate_root';
import { event_types, EventWithOnMethod, EventWithoutOnMethod } from './given/events';

describeThis(__filename, () => {
    let event_source: EventSourceId;
    let aggregate_root: AnAggregateRoot;

    beforeEach(() => {
        event_source = EventSourceId.from('f77f4484-e683-4971-9b90-4cbfafbd21f2');
        aggregate_root = new AnAggregateRoot(event_source);
        aggregate_root.eventTypes = event_types();
    });

    describe('that does not have an on-method', () => {
        let event: EventWithoutOnMethod;

        beforeEach(() => {
            event = new EventWithoutOnMethod('property');
            aggregate_root.applyWithoutOnMethod(event);
        });

        it('should have applied one event', () => aggregate_root.appliedEvents.should.have.length(1));
        it('should have applied the correct event', () => aggregate_root.appliedEvents[0].event.should.equal(event));
        it('should not apply the event as public', () => aggregate_root.appliedEvents[0].isPublic.should.be.false);
        it('should not have called an on-method', () => aggregate_root.onMethodEventsCalled.should.have.length(0));
    });

    describe('that has an on-method', () => {
        let event: EventWithOnMethod;

        beforeEach(() => {
            event = new EventWithOnMethod(42);
            aggregate_root.applyWithOnMethod(event);
        });

        it('should have applied one event', () => aggregate_root.appliedEvents.should.have.length(1));
        it('should have applied the correct event', () => aggregate_root.appliedEvents[0].event.should.equal(event));
        it('should not apply the event as public', () => aggregate_root.appliedEvents[0].isPublic.should.be.false);
        it('should not have called an on-method', () => aggregate_root.onMethodEventsCalled.should.have.length(1));
        it('should call the on-method with the correct event', () => aggregate_root.onMethodEventsCalled[0].should.equal(event));
    });
});
