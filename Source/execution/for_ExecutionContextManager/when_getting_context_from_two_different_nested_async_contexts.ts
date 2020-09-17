// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ExecutionContextManager, Version, TenantId, MicroserviceId, ExecutionContext, Environment } from '../index';


describe('when getting context from two different nested async contexts', async () => {
    const microserviceId = MicroserviceId.from('c87b335d-be3b-48ca-87c6-f6df2c3939a2');
    const version = new Version(1, 0, 0, 0);
    const environment = Environment.development;
    const firstLevelTenant = TenantId.from('941b5d80-1fdd-4f1e-996f-dc1126338f3d');
    const secondLevelTenant = TenantId.from('11850573-b164-4835-8398-d1a48d9bb9be');

    const executionContextManager = new ExecutionContextManager(microserviceId, version, environment);

    const base = executionContextManager.current;
    let firstLevel: ExecutionContext;
    let secondLevel: ExecutionContext;

    before(() => {
        const promise = new Promise((resolve) => {
            setTimeout(() => {
                executionContextManager.forTenant(firstLevelTenant);
                firstLevel = executionContextManager.current;

                setTimeout(() => {
                    executionContextManager.forTenant(secondLevelTenant);
                    secondLevel = executionContextManager.current;

                    resolve();
                });
            }, 1);
        });

        return promise;
    });

    it('should have first level be different from base', () => firstLevel.should.not.equal(base));
    it('should have first level correlation id be different from base', () => firstLevel.correlationId.should.not.equal(base.correlationId));
    it('should set tenant for first level', () => firstLevel.tenantId.should.equal(firstLevelTenant));
    it('should have second level be different from first level', () => secondLevel.should.not.equal(firstLevel));
    it('should have second level correlation id be different from first levels', () => secondLevel.correlationId.should.not.equal(firstLevel.correlationId));
    it('should set tenant for second level', () => secondLevel.tenantId.should.equal(secondLevelTenant));
});
