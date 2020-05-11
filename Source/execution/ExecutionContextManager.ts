// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import async_hooks from 'async_hooks';

import { IExecutionContextManager } from './IExecutionContextManager';
import { ExecutionContext } from './ExecutionContext';
import { Version } from './Version';
import { MicroserviceId } from './MicroserviceId';
import { CorrelationId } from './CorrelationId';
import { TenantId } from './TenantId';
import { Claims } from './Claims';


/**
 * Represents an implementation of {IExecutionContextManager}.
 */
export class ExecutionContextManager implements IExecutionContextManager {
    private _microserviceId: MicroserviceId;
    private _version: Version;
    private _environment: string;

    private _executionContextByAsyncId: Map<number, ExecutionContext> = new Map();
    private _base: ExecutionContext;

    /**
     * Creates an instance of execution context manager.
     * @param {MicroserviceId} microserviceId The unique identifier of the microservice.
     * @param {Version} version The version of the currently running software.
     * @param {string} environment The environment the software is running in. (e.g. development, production).
     */
    constructor(microserviceId: MicroserviceId, version: Version, environment: string) {
        this._microserviceId = microserviceId;
        this._version = version;
        this._environment = environment;

        this._base = new ExecutionContext(microserviceId, TenantId.system, version, environment, CorrelationId.system, Claims.empty);

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
                CorrelationId.create(),
                this._base.claims
            );
            this._executionContextByAsyncId.set(asyncId, executionContext);
        }
        return executionContext;
    }

    /** @inheritdoc */
    currentFor(tenantId: TenantId, claims?: Claims): ExecutionContext {
        const asyncId = async_hooks.executionAsyncId();

        const current = this.current;
        const executionContext = new ExecutionContext(
            this._microserviceId,
            tenantId,
            this._version,
            this._environment,
            current.correlationId,
            claims ?? this._base.claims
        );

        this._executionContextByAsyncId.set(asyncId, executionContext);
        return executionContext;
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
            CorrelationId.create(),
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
