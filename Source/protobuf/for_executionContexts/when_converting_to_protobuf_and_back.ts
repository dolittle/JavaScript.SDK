// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ExecutionContext, Version, Claim, Claims, MicroserviceId, TenantId, CorrelationId, Environment } from '@dolittle/sdk.execution';

import { executionContexts } from '../index';

describe('when converting to protobuf and back', () => {
    const claimsArray: Claim[] = [
        new Claim('first', 'first value', 'first value type'),
        new Claim('second', 'second value', 'second value type')
    ];
    const claims = new Claims(claimsArray);

    const original = new ExecutionContext(
        MicroserviceId.from('98260f59-9b4c-4730-a9c5-8254a8c32b18'),
        TenantId.from('3461f78c-2a06-4fe4-8d6d-7db92dbff038'),
        new Version(42,43,43,44,'alpha'),
        Environment.development,
        CorrelationId.from('ba704191-1659-4e5c-b124-fe1c63e5bcbe'),
        claims
    );

    const result = executionContexts.toSDK(executionContexts.toProtobuf(original));
    const resultClaims = result.claims.toArray();

    it('should hold the same microservice identifier', () => result.microserviceId.toString().should.equal(original.microserviceId.toString()));
    it('should hold the same tenand identifier', () => result.tenantId.toString().should.equal(original.tenantId.toString()));
    it('should hold the same version identifier', () => result.version.toString().should.equal(original.version.toString()));
    it('should hold the same environment identifier', () => result.environment.equals(original.environment).should.be.true);
    it('should hold the same correlation identifier', () => result.correlationId.toString().should.equal(original.correlationId.toString()));

    it('should contain same key for first claim', () => resultClaims[0].key.should.equal(claimsArray[0].key));
    it('should contain same value for first claim', () => resultClaims[0].value.should.equal(claimsArray[0].value));
    it('should contain same value type for first claim', () => resultClaims[0].valueType.should.equal(claimsArray[0].valueType));

    it('should contain same key for second claim', () => resultClaims[1].key.should.equal(claimsArray[1].key));
    it('should contain same value for second claim', () => resultClaims[1].value.should.equal(claimsArray[1].value));
    it('should contain same value type for second claim', () => resultClaims[1].valueType.should.equal(claimsArray[1].valueType));
});
