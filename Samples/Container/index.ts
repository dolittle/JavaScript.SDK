// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import 'reflect-metadata';
import { DolittleClient } from '@dolittle/sdk';
import { TenantId } from '@dolittle/sdk.execution';
import { Container } from 'inversify';

import './MyEventHandler';
import { MyEvent } from './MyEvent';
import { MyService } from './MyService';
import { MyTenantScopedService } from './MyTenantScopedService';

(async () => {
    const container = new Container();
    container.bind(MyService).toSelf();

    const client = await DolittleClient
        .setup()
        .connect(_ => _
            .withServiceProvider(container)
            .withTenantServices((services, tenant) => {
                services.bind(MyTenantScopedService).toType(MyTenantScopedService);
            })
        );

    await client
        .eventStore
        .forTenant(TenantId.development)
        .commit(new MyEvent(42, 'Forty Two'), 'Event Source');
})();
