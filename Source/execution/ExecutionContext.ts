// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import { Version } from './Version';
import { MicroserviceId } from './MicroserviceId';
import { TenantId } from './TenantId';
import { Claims } from './Claims';
import { CorrelationId } from './CorrelationId';
import { Environment } from './Environment';

/**
 * Represents the execution context in a running application.
 */
export class ExecutionContext {
    /**
     * Creates an instance of execution context.
     * @param {MicroserviceId}_microserviceId - The microservice identifier.
     * @param {TenantId} _tenantId - The current tenant identifier.
     * @param {Version} version - The current version of the software.
     * @param {string} environment - The current environment running in.
     * @param {CorrelationId} _correlationId - The current correlation id for execution context being performed.
     * @param {Claims} claims - The current claims for the context.
     */
    constructor(
        private _microserviceId: MicroserviceId,
        private _tenantId: TenantId,
        readonly version: Version,
        readonly environment: Environment,
        private _correlationId: CorrelationId,
        readonly claims: Claims) {
    }

    /**
     * Gets the microservice identifier.
     */
    get microserviceId(): MicroserviceId { return this._microserviceId; }

    /**
     * Gets the tenant identifier.
     */
    get tenantId(): TenantId { return this._tenantId; }

    /**
     * Gets the correlation identifier.
     */
    get correlationId(): CorrelationId { return this._correlationId; }

    /**
     * Creates a new execution context from the current with the provided tenant id.
     * @param {TenantId | Guid | string} tenantId - The tenant id.
     * @returns {ExecutionContext} The new execution context.
     */
    forTenant(tenantId: TenantId | Guid | string): ExecutionContext{
        return new ExecutionContext(
            this.microserviceId,
            TenantId.from(tenantId),
            this.version,
            this.environment,
            this.correlationId,
            this.claims);
    };

    /**
     * Creates a new execution context from the current with the provided correlation id.
     * @param {CorrelationId | Guid | string} correlationId - The correlation id.
     * @returns {ExecutionContext} The new execution context.
     */
    forCorrelation(correlationId: CorrelationId | Guid | string): ExecutionContext{
        return new ExecutionContext(
            this.microserviceId,
            this.tenantId,
            this.version,
            this.environment,
            CorrelationId.from(correlationId),
            this.claims);
    };

    /**
     * Creates a new execution context from the current with the provided claims.
     * @param {Claims} claims - The claims.
     * @returns {ExecutionContext} The new execution context.
     */
    forClaims(claims: Claims): ExecutionContext{
        return new ExecutionContext(
            this.microserviceId,
            this.tenantId,
            this.version,
            this.environment,
            this.correlationId,
            claims);
    };
    // /**
    //  * Gets parent execution context.
    //  */
    // get parent(): ExecutionContext | undefined {
    //     return this._parent;
    // }

    // /**
    //  * Sets parent execution context - should not be used directly, this is for internal use.
    //  * @param {ExecutionContext} parent - The parent execution context.
    //  */
    // setParent(parent: ExecutionContext) {
    //     this._parent = parent;
    // }
}
