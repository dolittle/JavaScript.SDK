// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { ClientBuildResult } from './ClientBuildResult';
import { IClientBuildResults } from './IClientBuildResults';

/**
 * Represents an implementation of {@link IClientBuildResults}.
 */
export class ClientBuildResults extends IClientBuildResults {
    private readonly _results: ClientBuildResult[] = [];
    private _failed: boolean = false;

    /** @inheritdoc */
    addInformation(message: string): void {
        this._results.push({
            type: 'information',
            message,
        });
    }

    /** @inheritdoc */
    addFailure(message: string, fix?: string): void {
        this._failed = true;
        this._results.push({
            type: 'failure',
            message,
            fix,
        });
    }

    /** @inheritdoc */
    addError(error: Error): void {
        this._failed = true;
        this._results.push({
            type: 'error',
            error,
        });
    }

    /** @inheritdoc */
    get failed(): boolean {
        return this._failed;
    }

    /**
     * Writes the build results to the provided logger.
     * @param {Logger} logger - The logger to write to.
     */
    writeTo(logger: Logger): void {
        for (const result of this._results) {
            switch (result.type) {
                case 'information':
                    logger.debug(result.message);
                    break;
                case 'failure':
                    result.fix !== undefined
                        ? logger.warn(`${result.message}. ${result.fix}`)
                        : logger.warn(result.message);
                    break;
                case 'error':
                    logger.error(result.error.message);
                    break;
            }
        }
    }
}
