// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { DefaulLevels, LoggerOptions, format, transports, createLogger } from 'winston';
import { MicroserviceId } from '@dolittle/sdk.execution';

export type LoggingBuilderCallback = (callback: LoggingBuilder) => void;
export type WinstonOptionsCallback = (options: LoggerOptions) => void;

/**
 * Represents a builder for configuring logging.
 */
export class LoggingBuilder {
    // DefaulLevels is a typo: https://github.com/winstonjs/winston/pull/1819
    private _options: LoggerOptions<DefaulLevels> = {
            level: 'info',
            format: format.prettyPrint(),
            defaultMeta: {},
            transports: [
                new transports.Console({
                    format: format.prettyPrint()
                })
            ]
        };

    /**
     * Configure {@LoggerOptions} for winston logger.
     * @param {WinstonOptionsCallback} callback
     */
    useWinston(callback: WinstonOptionsCallback) {
        callback(this._options);
        return this;
    }

    /**
     * Builds the configured logger.
     * @param microserviceId Sets the {@link MicroserviceId} in the defaultMeta in winston.
     */
    build(microserviceId: MicroserviceId) {
        if (!this._options.defaultMeta.microserviceId) {
            this._options.defaultMeta.microserviceId = microserviceId.toString();
        }
        return createLogger(this._options);
    }
}
