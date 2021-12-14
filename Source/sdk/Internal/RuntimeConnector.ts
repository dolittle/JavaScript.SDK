// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { Version } from '@dolittle/sdk.execution';
import { Cancellation } from '@dolittle/sdk.resilience';

import { HandshakeClient } from '@dolittle/runtime.contracts/Handshake/Handshake_grpc_pb';
import { TenantsClient } from '@dolittle/runtime.contracts/Tenancy/Tenants_grpc_pb';

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
        throw new Error('Method not implemented.');
    }

}
