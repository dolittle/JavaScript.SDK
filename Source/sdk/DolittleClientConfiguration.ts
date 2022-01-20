// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { KnownServiceProviders, TenantServiceBindingCallback } from '@dolittle/sdk.dependencyinversion';
import { Version } from '@dolittle/sdk.execution';

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
    runtimeOn?: string | {
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

    /**
     * The root service provider to use to resolve services for the client.
     */
    serviceProvider?: KnownServiceProviders;

    /**
     * Tenant specific service bindings to the service providers used for processing in the client.
     */
    tenantServices?: TenantServiceBindingCallback;
};
