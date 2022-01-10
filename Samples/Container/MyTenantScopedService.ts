// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { TenantId } from '@dolittle/sdk.execution';
import { inject } from 'inversify';
import { Logger } from 'winston';

export class MyTenantScopedService {
    constructor(
        @inject('Logger') private readonly _logger: Logger,
        @inject(TenantId) private readonly _tenantId: TenantId,
    ) {
        this._logger.info(`Constructing MyTenantScopedService for ${this._tenantId}`);
    }

    doStuff() {
        this._logger.info(`Doing stuff in the Tenant scoped Service for ${this._tenantId}`);
    }
}
