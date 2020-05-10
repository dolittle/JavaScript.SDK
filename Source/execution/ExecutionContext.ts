// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { MicroserviceId } from './MicroserviceId';
import { TenantId } from './TenantId';
import { CorrelationId } from './CorrelationId';
import { Claims } from './Claims';
import { Version } from './Version';

export class ExecutionContext {
    private _parent: ExecutionContext | undefined;

    readonly microserviceId: MicroserviceId;
    readonly tenantId: TenantId;
    readonly version: Version;
    readonly environment: string;
    readonly correlationId: CorrelationId;
    readonly claims: Claims;

    constructor(microserviceId: MicroserviceId, tenantId: TenantId, version: Version, environment: string, correlationId: CorrelationId, claims: Claims) {
        this.microserviceId = microserviceId;
        this.tenantId = tenantId;
        this.version = version;
        this.environment = environment;
        this.correlationId = correlationId;
        this.claims = claims;
    }

    get parent(): ExecutionContext | undefined {
        return this._parent;
    }

    setParent(parent: ExecutionContext) {
        this._parent = parent;
    }
}
