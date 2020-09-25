// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Version } from './Version';
import { MicroserviceId } from './MicroserviceId';
import { TenantId } from './TenantId';
import { Claims } from './Claims';
import { CorrelationId } from './CorrelationId';
import { Environment } from './Environment';

/**
 * Represents the execution context in a running application.
 */
export class ExecutionContext {
    private _parent: ExecutionContext | undefined;

    /**
     * Creates an instance of execution context.
     * @param {MicroserviceId} microserviceId The microservice identifier.
     * @param {TenantId} tenantId The current tenant identifier.
     * @param {Version} version The current version of the software.
     * @param {string} environment The current environment running in.
     * @param {CorrelationId} correlationId The current correlation id for execution context being performed.
     * @param {Claims} claims The current claims for the context.
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
     * Gets the microservice identifier
     * @returns {MicroserviceId}
     */
    get microserviceId(): MicroserviceId { return this._microserviceId; }

    /**
     * Gets the tenant identifier
     * @returns {Guid}
     */
    get tenantId(): TenantId { return this._tenantId; }

    /**
     * Gets the correlation identifier
     * @returns {CorrelationId}
     */
    get correlationId(): CorrelationId { return this._correlationId; }

    /**
     * Gets parent execution context
     */
    get parent(): ExecutionContext | undefined {
        return this._parent;
    }

    /**
     * Sets parent execution context - should not be used directly, this is for internal use.
     * @param {ExecutionContext} parent The parent execution context.
     */
    setParent(parent: ExecutionContext) {
        this._parent = parent;
    }
}
