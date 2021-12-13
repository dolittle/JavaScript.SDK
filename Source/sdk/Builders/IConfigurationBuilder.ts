// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { KnownServiceProviders, TenantServiceBindingCallback } from '@dolittle/sdk.dependencyinversion';
import { Version } from '@dolittle/sdk.execution';

import { ConnectConfiguration } from '../Internal/ConnectConfiguration';

/**
 * Represents a builder for building a {@link ConnectConfiguration}.
 */
export abstract class IConfigurationBuilder {
    /**
     * Sets the version of the microservice.
     * @param {Version} version - Version of the microservice.
     * @returns {IConfigurationBuilder} The client builder for continuation.
     */
    abstract withVersion(version: Version): IConfigurationBuilder;
    /**
     * Sets the version of the microservice.
     * @param {number} major - Major version of the microservice.
     * @param {number} minor - Minor version of the microservice.
     * @param {number} patch - Patch version of the microservice.
     * @returns {IConfigurationBuilder} The client builder for continuation.
     */
    abstract withVersion(major: number, minor: number, patch: number): IConfigurationBuilder;

    /**
     * Sets the version of the microservice.
     * @param {number} major - Major version of the microservice.
     * @param {number} minor - Minor version of the microservice.
     * @param {number} patch - Patch version of the microservice.
     * @param {number} build - Builder number of the microservice.
     * @param {string} preReleaseString - If prerelease - the prerelease string.
     * @returns {IConfigurationBuilder} The client builder for continuation.
     */
    abstract withVersion(major: number, minor: number, patch: number, build: number, preReleaseString: string): IConfigurationBuilder;

    /**
     * Connect to a specific host and port for the Dolittle runtime.
     * @param {string} host - The host name to connect to.
     * @param {number} port - The port to connect to.
     * @returns {IConfigurationBuilder} The client builder for continuation.
     * @summary If not used, the default host of 'localhost' and port 50053 will be used.
     */
    abstract withRuntimeOn(host: string, port: number): IConfigurationBuilder;

    /**
     * Set the winston logger to use in the microservice.
     * @param {Logger} logger - A winston logger.
     * @returns {IConfigurationBuilder} The client builder for continuation.
     * @see {@link https://github.com/winstonjs/winston} for further information.
     */
    abstract withLogging(logger: Logger): IConfigurationBuilder;

    /**
     * Sets the ping interval to use for keeping processors connected to the Runtime alive.
     * @param {number} interval - The ping interval.
     * @returns {IConfigurationBuilder} The client builder for continuation.
     */
    abstract withPingInterval(interval: number): IConfigurationBuilder;

    /**
     * Configures the root service provider to use to resolve services for the client.
     * @param {KnownServiceProviders} serviceProvider - The service provider to use.
     * @returns {IConfigurationBuilder} The client builder for continuation.
     */
    abstract withServiceProvider(serviceProvider: KnownServiceProviders): IConfigurationBuilder;

    /**
     * Adds tenant specific service bindings to the service providers used for processing in the client.
     * @param {TenantServiceBindingCallback} callback - The callback used to bind tenant specific services.
     * @returns {IConfigurationBuilder} The client builder for continuation.
     */
    abstract withTenantServices(callback: TenantServiceBindingCallback): IConfigurationBuilder;
}
