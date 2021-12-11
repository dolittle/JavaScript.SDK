// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger, DefaulLevels, createLogger, format, transports } from 'winston';

import { Version } from '@dolittle/sdk.execution';

import { ConnectConfiguration } from '../Internal/ConnectConfiguration';
import { DolittleClientConfiguration } from '../DolittleClientConfiguration';
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
        this._logger = createLogger({
            level: 'info',
            format: format.simple(),
            transports: [
                new transports.Console({
                    format: format.simple(),
                }),
            ],
        });

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
    withPingInterval(interval: number): IConfigurationBuilder {
        this._pingInterval = interval;
        return this;
    }

    /** @inheritdoc */
    withLogging(logger: Logger<DefaulLevels>): IConfigurationBuilder {
        this._logger = logger;
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
            this._logger);
    }

    private applyFrom(from?: DolittleClientConfiguration) {
        if (from === undefined || from === null) {
            return;
        }

        this.applyFromVersion(from.version);
        this.applyFromRuntimeOn(from.runtimeOn);

        if (typeof from.pingInterval === 'number') {
            this._pingInterval = from.pingInterval;
        }
        if (from.logger !== undefined) {
            this._logger = from.logger;
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
                    this._runtimeHost = parts[0];
                    break;
                case 2:
                    this._runtimeHost = parts[0];
                    const port = parseInt(parts[1]);
                    if (isNaN(port)) {
                        throw new InvalidRuntimeAddressConfiguration(from);
                    }
                    this._runtimePort = port;
                    break;
                default:
                    throw new InvalidRuntimeAddressConfiguration(from);
            }
        } else {
            if (typeof from.host === 'string') {
                this._runtimeHost = from.host;
            }
            if (typeof from.port === 'number') {
                this._runtimePort = from.port;
            }
        }
    }
}
