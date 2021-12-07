// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Version } from '@dolittle/sdk.execution';
import { Logger } from 'winston';
import { IDolittleClient } from './IDolittleClient';

/**
 * Represents the configuration used to connect a {@link IDolittleClient}.
 */
export type DolittleClientConfiguration = {
    /**
     * The version of the microservice.
     */
    version?: Version | {
        major?: number;
        minor?: number;
        patch?: number;
        build?: number;
        preReleaseString?: string;
    };

    /**
     * The address of the Runtime to connect to.
     */
    runtime?: string | {
        /**
         * The host of the Runtime to connect to.
         */
        host?: string;
        /**
         * The port of the Runtime to connect to.
         */
        port?: number;
    };

    /**
     * The ping interval to use for keeping processors connected to the Runtime alive.
     */
    pingInterval?: number;

    /**
     * The {@link Logger} to use for logging in the client.
     */
    logger?: Logger;

    // TODO: ServiceProvider
};
