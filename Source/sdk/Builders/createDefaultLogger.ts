// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger, createLogger, format, transports } from 'winston';

/**
 * Creates a default {@link Logger} to be used when none is configured.
 * @returns {Logger} A default logger.
 */
export const createDefaultLogger = (): Logger => createLogger({
    level: 'info',
    format: format.simple(),
    transports: [
        new transports.Console({
            format: format.simple(),
        }),
    ],
});
