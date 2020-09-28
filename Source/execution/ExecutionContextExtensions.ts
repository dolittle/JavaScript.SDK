// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Claims } from './Claims';
import { CorrelationId } from './CorrelationId';
import { ExecutionContext } from './ExecutionContext';
import { TenantId } from './TenantId';

declare module './index' {
    interface ExecutionContext {
        forTenant(tenantId: Guid | string): ExecutionContext;
        forCorrelation(correlationId: Guid | string): ExecutionContext;
        forClaims(claims: Claims): ExecutionContext;
    }
}
ExecutionContext.prototype.forTenant = function (tenantId: Guid | string) {
    return new ExecutionContext(
        this.microserviceId,
        TenantId.from(tenantId),
        this.version,
        this.environment,
        this.correlationId,
        this.claims);
};
ExecutionContext.prototype.forCorrelation = function (correlationId: Guid | string) {
    return new ExecutionContext(
        this.microserviceId,
        this.tenantId,
        this.version,
        this.environment,
        CorrelationId.from(correlationId),
        this.claims);
};
ExecutionContext.prototype.forClaims = function (claims: Claims) {
    return new ExecutionContext(
        this.microserviceId,
        this.tenantId,
        this.version,
        this.environment,
        this.correlationId,
        claims);
};