// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger, DefaulLevels } from 'winston';

import { createRootServiceProvider, DefaultServiceProvider, IServiceProvider, KnownServiceProviders, TenantServiceBindingCallback } from '@dolittle/sdk.dependencyinversion';
import { Version } from '@dolittle/sdk.execution';

import { DolittleClientConfiguration } from '../DolittleClientConfiguration';
import { ConnectConfiguration } from '../Internal/ConnectConfiguration';
import { createDefaultLogger } from './createDefaultLogger';
import { IConfigurationBuilder } from './IConfigurationBuilder';
import { InvalidRuntimeAddressConfiguration } from './InvalidRuntimeAddressConfiguration';

/**
 * Represents an implementation of {@link IConfigurationBuilder}.
 */
export class ConfigurationBuilder extends IConfigurationBuilder {
    private _version: Version;
    private _runtimeHost: string;
    private _runtimePort: number;
    private _pingInterval: number;
    private _logger: Logger;
    private _serviceProvider: IServiceProvider;
    private _tenantServiceBindingCallbacks: TenantServiceBindingCallback[];

    /**
     * Initialises a new instance of the {@link ConfigurationBuilder} class.
     * @param {DolittleClientConfiguration} [from] - Optional inputs to start building the configuration from.
     */
    constructor(from?: DolittleClientConfiguration) {
        super();

        this._version = Version.notSet;
        this._runtimeHost = 'localhost';
        this._runtimePort = 50053;
        this._pingInterval = 5;
        this._logger = createDefaultLogger();
        this._serviceProvider = new DefaultServiceProvider();
        this._tenantServiceBindingCallbacks = [];

        this.applyFrom(from);
    }

    /** @inheritdoc */
    withVersion(version: Version): IConfigurationBuilder;
    withVersion(major: number, minor: number, patch: number): IConfigurationBuilder;
    withVersion(major: number, minor: number, patch: number, build: number, preReleaseString: string): IConfigurationBuilder;
    withVersion(versionOrMajor: Version | number, maybeMinor?: number, maybePatch?: number, maybeBuild?: number, maybePreReleaseString?: string): IConfigurationBuilder {
        if (versionOrMajor instanceof Version) {
            this._version = versionOrMajor;
        } else {
            const major = typeof versionOrMajor == 'number' ? versionOrMajor : 0;
            const minor = typeof maybeMinor == 'number' ? maybeMinor : 0;
            const patch = typeof maybePatch == 'number' ? maybePatch : 0;
            const build = typeof maybeBuild == 'number' ? maybeBuild : 0;
            const preReleaseString = typeof maybePreReleaseString == 'string' ? maybePreReleaseString : '';
            this._version = new Version(major, minor, patch, build, preReleaseString);
        }
        return this;
    }

    /** @inheritdoc */
    withRuntimeOn(host: string, port: number): IConfigurationBuilder {
        this._runtimeHost = host;
        this._runtimePort = port;
        return this;
    }

    /** @inheritdoc */
    withLogging(logger: Logger<DefaulLevels>): IConfigurationBuilder {
        this._logger = logger;
        return this;
    }

    /** @inheritdoc */
    withPingInterval(interval: number): IConfigurationBuilder {
        this._pingInterval = interval;
        return this;
    }

    /** @inheritdoc */
    withServiceProvider(serviceProvider: KnownServiceProviders): IConfigurationBuilder {
        this._serviceProvider = createRootServiceProvider(serviceProvider);
        return this;
    }

    /** @inheritdoc */
    withTenantServices(callback: TenantServiceBindingCallback): IConfigurationBuilder {
        this._tenantServiceBindingCallbacks.push(callback);
        return this;
    }

    /**
     * Builds a {@link ConnectConfiguration} from the configured builder.
     * @returns {ConnectConfiguration} The built configuration.
     */
    build(): ConnectConfiguration {
        return new ConnectConfiguration(
            this._version,
            this._runtimeHost,
            this._runtimePort,
            this._pingInterval,
            this._logger,
            this._serviceProvider,
            this._tenantServiceBindingCallbacks);
    }

    private applyFrom(from?: DolittleClientConfiguration) {
        if (from === undefined || from === null) {
            return;
        }

        this.applyFromVersion(from.version);
        this.applyFromRuntimeOn(from.runtimeOn);

        if (typeof from.pingInterval === 'number') {
            this.withPingInterval(from.pingInterval);
        }
        if (from.logger !== undefined) {
            this.withLogging(from.logger);
        }
        if (from.serviceProvider !== undefined) {
            this.withServiceProvider(from.serviceProvider);
        }
        if (typeof from.tenantServices === 'function') {
            this.withTenantServices(from.tenantServices);
        }
    }

    private applyFromVersion(from?: Version | { major?: number, minor?: number, patch?: number, build?: number, preReleaseString?: string}) {
        if (from === undefined || from === null) {
            return;
        }

        if (from instanceof Version) {
            this.withVersion(from);
        } else {
            this.withVersion(from.major!, from.minor!, from.patch!, from.build!, from.preReleaseString!);
        }
    }

    private applyFromRuntimeOn(from?: string | { host?: string, port?: number}) {
        if (from === undefined || from === null) {
            return;
        }

        if (typeof from === 'string') {
            const parts = from.split(':');
            switch (parts.length) {
                case 1:
                    this.withRuntimeOn(parts[0], this._runtimePort);
                    break;
                case 2:
                    const port = parseInt(parts[1]);
                    if (isNaN(port)) {
                        throw new InvalidRuntimeAddressConfiguration(from);
                    }
                    this.withRuntimeOn(parts[0], port);
                    break;
                default:
                    throw new InvalidRuntimeAddressConfiguration(from);
            }
        } else {
            if (typeof from.host === 'string') {
                this.withRuntimeOn(from.host, this._runtimePort);
            }
            if (typeof from.port === 'number') {
                this.withRuntimeOn(this._runtimeHost, from.port);
            }
        }
    }
}
