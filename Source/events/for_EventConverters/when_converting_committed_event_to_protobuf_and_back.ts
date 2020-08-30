// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { DateTime } from 'luxon';
import { Claim, Claims, ExecutionContext, Version, MicroserviceId, TenantId, CorrelationId, Environment } from '@dolittle/sdk.execution';
import { Artifact, ArtifactId, Generation } from '@dolittle/sdk.artifacts';

import { CommittedEvent, EventSourceId, EventConverters, EventLogSequenceNumber } from '../index';

describe('when converting committed event to protobuf and back', () => {
    const claimsArray: Claim[] = [
        new Claim('first', 'first value', 'first value type'),
        new Claim('second', 'second value', 'second value type')
    ];
    const claims = new Claims(claimsArray);

    const executionContext = new ExecutionContext(
        MicroserviceId.from('98260f59-9b4c-4730-a9c5-8254a8c32b18'),
        TenantId.from('3461f78c-2a06-4fe4-8d6d-7db92dbff038'),
        new Version(42, 43, 43, 44, 'alpha'),
        Environment.development,
        CorrelationId.from('ba704191-1659-4e5c-b124-fe1c63e5bcbe'),
        claims
    );

    const content = {
        someInteger: 42,
        someString: 'fourty two'
    };

    const externalReceived = DateTime.utc();

    const committedEvent = new CommittedEvent(
        EventLogSequenceNumber.from(42),
        DateTime.utc(),
        EventSourceId.from('3a52080d-c44b-4827-8d65-1325b7f055f2'),
        executionContext,
        new Artifact(ArtifactId.from('559c3025-fd90-4aad-9508-12a6ee517707'), Generation.from(43)),
        content,
        true,
        true,
        EventLogSequenceNumber.from(44),
        externalReceived
    );
    const result = EventConverters.toSDK(EventConverters.toProtobuf(committedEvent));
    const resultClaims = result.executionContext.claims.toArray();

    it('should have same event log sequence number', () => result.eventLogSequenceNumber.equals(committedEvent.eventLogSequenceNumber).should.be.true);
    it('should have same occurred', () => result.occurred.toUTC().toString().should.equal(committedEvent.occurred.toUTC().toString()));
    it('should have same event source id', () => result.eventSourceId.equals(committedEvent.eventSourceId).should.be.true);

    it('should hold the same microservice identifier', () => result.executionContext.microserviceId.equals(committedEvent.executionContext.microserviceId).should.be.true);
    it('should hold the same tenant identifier', () => result.executionContext.tenantId.equals(committedEvent.executionContext.tenantId).should.be.true);
    it('should hold the same version identifier', () => result.executionContext.version.toString().should.equal(committedEvent.executionContext.version.toString()));
    it('should hold the same environment identifier', () => result.executionContext.environment.equals(committedEvent.executionContext.environment).should.be.true);
    it('should hold the same correlation identifier', () => result.executionContext.correlationId.equals(committedEvent.executionContext.correlationId).should.be.true);

    it('should contain same key for first claim', () => resultClaims[0].key.should.equal(claimsArray[0].key));
    it('should contain same value for first claim', () => resultClaims[0].value.should.equal(claimsArray[0].value));
    it('should contain same value type for first claim', () => resultClaims[0].valueType.should.equal(claimsArray[0].valueType));

    it('should contain same key for second claim', () => resultClaims[1].key.should.equal(claimsArray[1].key));
    it('should contain same value for second claim', () => resultClaims[1].value.should.equal(claimsArray[1].value));
    it('should contain same value type for second claim', () => resultClaims[1].valueType.should.equal(claimsArray[1].valueType));

    it('should have same type', () => result.type.id.equals(committedEvent.type.id).should.be.true);
    it('should have same generation on type', () => result.type.generation.equals(committedEvent.type.generation).should.be.true);

    it('should have same public state', () => result.isPublic.should.equal(committedEvent.isPublic));
    it('should have same external state', () => result.isPublic.should.equal(committedEvent.isExternal));
    it('should have same external event log sequence number', () => result.externalEventLogSequenceNumber.should.equal(committedEvent.externalEventLogSequenceNumber));
    it('should have same external event received', () => result.externalEventReceived.toUTC().toString().should.equal(committedEvent.externalEventReceived.toUTC().toString()));
});
