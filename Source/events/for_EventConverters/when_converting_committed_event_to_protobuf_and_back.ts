// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { CommittedEvent } from '../CommittedEvent';
import { DateTime } from 'luxon';
import { Guid } from '@dolittle/rudiments';
import { Claim } from '@dolittle/sdk.execution';
import { Claims } from '@dolittle/sdk.execution';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { Version } from '@dolittle/sdk.execution';
import { Artifact } from '@dolittle/sdk.artifacts';

import { EventConverters } from '../EventConverters';

describe('when converting committed event to protobuf and back', () => {
    const claimsArray: Claim[] = [
        new Claim('first', 'first value', 'first value type'),
        new Claim('second', 'second value', 'second value type')
    ];
    const claims = new Claims(claimsArray);

    const executionContext = new ExecutionContext(
        Guid.parse('98260f59-9b4c-4730-a9c5-8254a8c32b18'),
        Guid.parse('3461f78c-2a06-4fe4-8d6d-7db92dbff038'),
        new Version(42, 43, 43, 44, 'alpha'),
        'development',
        Guid.parse('ba704191-1659-4e5c-b124-fe1c63e5bcbe'),
        claims
    );

    const content = {
        someInteger: 42,
        someString: 'fourty two'
    };

    const externalReceived = DateTime.utc();

    const committedEvent = new CommittedEvent(
        42,
        DateTime.utc(),
        Guid.parse('3a52080d-c44b-4827-8d65-1325b7f055f2'),
        executionContext,
        new Artifact(Guid.parse('559c3025-fd90-4aad-9508-12a6ee517707'), 43),
        content,
        true,
        true,
        44,
        externalReceived
    );
    const result = EventConverters.toSDK(EventConverters.toProtobuf(committedEvent));
    const resultClaims = result.executionContext.claims.toArray();

    it('should have same event log sequence number', () => result.eventLogSequenceNumber.should.equal(committedEvent.eventLogSequenceNumber));
    it('should have same occurred', () => result.occurred.toUTC().toString().should.equal(committedEvent.occurred.toUTC().toString()));
    it('should have same event source id', () => result.eventSourceId.toString().should.equal(committedEvent.eventSourceId.toString()));

    it('should hold the same microservice identifier', () => result.executionContext.microserviceId.toString().should.equal(committedEvent.executionContext.microserviceId.toString()));
    it('should hold the same tenand identifier', () => result.executionContext.tenantId.toString().should.equal(committedEvent.executionContext.tenantId.toString()));
    it('should hold the same version identifier', () => result.executionContext.version.toString().should.equal(committedEvent.executionContext.version.toString()));
    it('should hold the same environment identifier', () => result.executionContext.environment.should.equal(committedEvent.executionContext.environment));
    it('should hold the same correlation identifier', () => result.executionContext.correlationId.toString().should.equal(committedEvent.executionContext.correlationId.toString()));

    it('should contain same key for first claim', () => resultClaims[0].key.should.equal(claimsArray[0].key));
    it('should contain same value for first claim', () => resultClaims[0].value.should.equal(claimsArray[0].value));
    it('should contain same value type for first claim', () => resultClaims[0].valueType.should.equal(claimsArray[0].valueType));

    it('should contain same key for second claim', () => resultClaims[1].key.should.equal(claimsArray[1].key));
    it('should contain same value for second claim', () => resultClaims[1].value.should.equal(claimsArray[1].value));
    it('should contain same value type for second claim', () => resultClaims[1].valueType.should.equal(claimsArray[1].valueType));

    it('should have same type', () => result.type.id.toString().should.equal(committedEvent.type.id.toString()));
    it('should have same generation on type', () => result.type.generation.should.equal(committedEvent.type.generation));

    it('should have same public state', () => result.isPublic.should.equal(committedEvent.isPublic));
    it('should have same external state', () => result.isPublic.should.equal(committedEvent.isExternal));
    it('should have same external event log sequence number', () => result.externalEventLogSequenceNumber.should.equal(committedEvent.externalEventLogSequenceNumber));
    it('should have same external event received', () => result.externalEventReceived.toUTC().toString().should.equal(committedEvent.externalEventReceived.toUTC().toString()));
});
