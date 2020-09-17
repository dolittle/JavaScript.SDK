// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import async_hooks from 'async_hooks';
import { Claims, IExecutionContextManager, MicroserviceId, Version, ExecutionContext, TenantId, CorrelationId, Environment } from './index';
import { Guid } from '@dolittle/rudiments';


/**
 * Represents an implementation of {@link IExecutionContextManager}.
 */
export class ExecutionContextManager implements IExecutionContextManager {
    private _executionContextByAsyncId: Map<number, ExecutionContext> = new Map();
    private _base: ExecutionContext;

    /**
     * Initializes a new instance of {@link IExecutionContextManager}.
     * @param {MicroserviceId} microserviceId The unique identifier of the microservice.
     * @param {Version} version The version of the currently running software.
     * @param {string} environment The environment the software is running in. (e.g. development, production).
     */
    constructor(private _microserviceId: MicroserviceId, private _version: Version, private _environment: Environment) {
        this._base = new ExecutionContext(_microserviceId, TenantId.system, _version, _environment, CorrelationId.system, Claims.empty);

        async_hooks.createHook({
            init: this.asyncOperationInit.bind(this),
            destroy: this.asyncOperationDestroy.bind(this)
        }).enable();
    }

    /** @inheritdoc */
    get current(): ExecutionContext {
        const asyncId = async_hooks.executionAsyncId();
        let executionContext = this._executionContextByAsyncId.get(asyncId);
        if (!executionContext) {
            executionContext = new ExecutionContext(
                this._microserviceId,
                this._base.tenantId,
                this._version,
                this._environment,
                CorrelationId.new(),
                this._base.claims
            );
            this._executionContextByAsyncId.set(asyncId, executionContext);
        }
        return executionContext;
    }

    /** @inheritdoc */
    forTenant(tenantId: TenantId | string, claims?: Claims): ExecutionContextManager {
        const asyncId = async_hooks.executionAsyncId();
        const current = this.current;
        const executionContext = new ExecutionContext(
            current.microserviceId,
            TenantId.from(tenantId),
            current.version,
            current.environment,
            current.correlationId,
            claims ?? this._base.claims
        );

        this._executionContextByAsyncId.set(asyncId, executionContext);
        return this;
    }

    private asyncOperationInit(asyncId: number, type: string, triggerAsyncId: number, resource: object): void {
        let parent: ExecutionContext;

        if (this._executionContextByAsyncId.has(triggerAsyncId)) {
            parent = this._executionContextByAsyncId.get(triggerAsyncId) || this._base;
        } else {
            parent = this._base;
        }

        const executionContext = new ExecutionContext(
            this._microserviceId,
            parent.tenantId,
            this._version,
            this._environment,
            CorrelationId.new(),
            parent.claims
        );

        this._executionContextByAsyncId.set(asyncId, executionContext);
    }

    private asyncOperationDestroy(asyncId: number): void {
        if (this._executionContextByAsyncId.has(asyncId)) {
            this._executionContextByAsyncId.delete(asyncId);
        }
    }
}
