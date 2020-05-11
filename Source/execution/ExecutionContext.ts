// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { MicroserviceId } from './MicroserviceId';
import { TenantId } from './TenantId';
import { CorrelationId } from './CorrelationId';
import { Claims } from './Claims';
import { Version } from './Version';

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
        readonly microserviceId: MicroserviceId,
        readonly tenantId: TenantId,
        readonly version: Version,
        readonly environment: string,
        readonly correlationId: CorrelationId,
        readonly claims: Claims) {
    }

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
