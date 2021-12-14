// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';
import { from, Notification, Observable } from 'rxjs';
import { concatMap, delay, dematerialize, map } from 'rxjs/operators';
import { status as GrpcStatus } from '@grpc/grpc-js';

import { Claims, CorrelationId, Environment, ExecutionContext, MicroserviceId, TenantId, Version } from '@dolittle/sdk.execution';
import { Failures, Guids, Versions } from '@dolittle/sdk.protobuf';
import { Cancellation, RetryPolicy, retryWithPolicy } from '@dolittle/sdk.resilience';
import { isGrpcError, reactiveUnary } from '@dolittle/sdk.services';
import { Internal } from '@dolittle/sdk.tenancy';

import { HandshakeClient } from '@dolittle/runtime.contracts/Handshake/Handshake_grpc_pb';
import { HandshakeRequest, HandshakeResponse } from '@dolittle/runtime.contracts/Handshake/Handshake_pb';
import { TenantsClient } from '@dolittle/runtime.contracts/Tenancy/Tenants_grpc_pb';
import { VersionInfo as ContractsVersionInfo } from '@dolittle/runtime.contracts/VersionInfo';

import { RuntimeHandshakeFailed } from '../RuntimeHandshakeFailed';
import { RuntimeHandshakeMissingInformation } from '../RuntimeHandshakeMissingInformation';
import { RuntimeVersionNotCompatible } from '../RuntimeVersionNotCompatible';
import { VersionInfo } from '../VersionInfo';
import { ConnectionResult } from './ConnectionResult';
import { ICanConnectToARuntime } from './ICanConnectToARuntime';

/**
 * Represents an implementation of {@link ICanConnectToARuntime}.
 */
export class RuntimeConnector extends ICanConnectToARuntime {
    /**
     * Initialises a new instance of the {@link RuntimeConnector} class.
     * @param {HandshakeClient} _handshakeClient - The client to use to perform the handshake.
     * @param {TenantsClient} _tenantsClient - The client to use for fetching the configured tenants.
     * @param {Version} _headVersion - The version of the head to use in the handshake.
     * @param {Logger} _logger - To use for logging.
     */
    constructor(
        private readonly _handshakeClient: HandshakeClient,
        private readonly _tenantsClient: TenantsClient,
        private readonly _headVersion: Version,
        private readonly _logger: Logger,
    ) {
        super();
    }

    /** @inheritdoc */
    async connect(cancellation: Cancellation = Cancellation.default): Promise<ConnectionResult> {
        return retryWithPolicy(
            this.createConnectCall(cancellation),
            this.createRetryPolicy(),
            cancellation)
        .toPromise();
    }

    private createConnectCall(cancellation: Cancellation): Observable<ConnectionResult> {
        const startTime = Date.now();
        let attempt = 0;

        return new Observable((subscriber) => {
            const timeSinceStart = Date.now() - startTime;
            attempt += 1;

            const handshake = reactiveUnary(
                this._handshakeClient,
                this._handshakeClient.handshake,
                this.createHandshakeRequest(attempt, timeSinceStart),
                cancellation)
            .pipe(map((response) => {
                if (response.hasFailure()) {
                    const failure = Failures.toSDK(response.getFailure()!);
                    throw new RuntimeHandshakeFailed(failure.reason);
                    // TODO: Handle incompatible versions failure ID
                }

                return this.createExecutionContextFrom(response);
            }))
            .pipe(concatMap((executionContext) => {
                const tenants = new Internal.Tenants(this._tenantsClient, executionContext, this._logger);

                return from(tenants.getAll(cancellation))
                .pipe(map((tenants) => {
                    return new ConnectionResult(
                        executionContext,
                        tenants,
                        tenants.map(_ => _.id));
                }));
            }));

            handshake.subscribe(subscriber);
        });
    }

    private createRetryPolicy(): RetryPolicy {
        return (errors) => errors.pipe(
            delay(1000),
            map((error) => {
                if (isGrpcError(error) && error.code === GrpcStatus.UNIMPLEMENTED) {
                    return Notification.createError<Error>(RuntimeVersionNotCompatible.unimplemented);
                } else if (error instanceof RuntimeVersionNotCompatible) {
                    return Notification.createError<Error>(error);
                }

                this._logger.warn(`Connection to Runtime failed, will retry in 1 second. Reason: ${error.message}`);
                return Notification.createNext(error);
            }),
            dematerialize(),
        );
    }

    private createHandshakeRequest(attempt: number, millisecondsSinceStart: number): HandshakeRequest {
        const handshakeRequest = new HandshakeRequest();

        handshakeRequest.setSdk('JS.SDK');
        handshakeRequest.setHeadversion(Versions.toProtobuf(this._headVersion));
        handshakeRequest.setSdkversion(Versions.toProtobuf(VersionInfo.currentVersion));
        handshakeRequest.setContractsversion(ContractsVersionInfo.getCurrentVersion());

        // TODO: Add attempt and time since start to request

        return handshakeRequest;
    }

    private createExecutionContextFrom(response: HandshakeResponse): ExecutionContext {
        this.throwIfResponseIsMissingInformation(response);

        const runtimeVersion = Versions.toSDK(response.getRuntimeversion());
        const contractsVersion = Versions.toSDK(response.getContractsversion());
        this._logger.debug(`Received initial booting configuration from Runtime running version ${runtimeVersion} using Contracts version ${contractsVersion}`);

        const microserviceId = MicroserviceId.from(Guids.toSDK(response.getMicroserviceid()));
        const environment = Environment.from(response.getEnvironment());

        return new ExecutionContext(
            microserviceId,
            TenantId.system,
            this._headVersion,
            environment,
            CorrelationId.system,
            Claims.empty);
    }

    private throwIfResponseIsMissingInformation(response: HandshakeResponse): void {
        if (!response.hasRuntimeversion()) throw new RuntimeHandshakeMissingInformation('Runtime version');
        if (!response.hasContractsversion()) throw new RuntimeHandshakeMissingInformation('Contracts version');
        if (!response.hasMicroserviceid()) throw new RuntimeHandshakeMissingInformation('microservice ID');
        if (response.getEnvironment() === '') throw new RuntimeHandshakeMissingInformation('environment');
    }
}
