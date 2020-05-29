// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { MicroserviceId } from './MicroserviceId';
import { TenantId } from './TenantId';
import { CorrelationId } from './CorrelationId';
import { Claims } from './Claims';
import { Version } from './Version';
import { Guid } from '@dolittle/rudiments';

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
        readonly environment: string,
        private _correlationId: CorrelationId,
        readonly claims: Claims) {
    }


    /**
     * Gets the microservice identifier
     * @returns {Guid}
     */
    get microserviceId(): Guid { return Guid.as(this._microserviceId); }

    /**
     * Gets the tenant identifier
     * @returns {Guid}
     */
    get tenantId(): Guid { return Guid.as(this._tenantId); }

    /**
     * Gets the correlation identifier
     * @returns {Guid}
     */
    get correlationId(): Guid { return Guid.as(this._correlationId); }

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
