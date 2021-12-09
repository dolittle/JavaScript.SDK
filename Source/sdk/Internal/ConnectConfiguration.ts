// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';
import { Version } from '@dolittle/sdk.execution';

/**
 * Represents the configuration used to connect a {@link IDolittleClient}.
 */
export class ConnectConfiguration {
    /**
     * Initialises a new instance of the {@link ConnectConfiguration} class.
     * @param {Version} version - The version of the microservice.
     * @param {string} runtimeHost - The host of the Runtime to connect to.
     * @param {number} runtimePort - The port of the Runtime to connect to.
     * @param {number} pingInterval - The ping interval to use for keeping processors connected to the Runtime alive.
     * @param {Logger} logger - The logger to use for logging in the client.
     */
    constructor(
        readonly version: Version,
        readonly runtimeHost: string,
        readonly runtimePort: number,
        readonly pingInterval: number,
        readonly logger: Logger
    ) {}
}
