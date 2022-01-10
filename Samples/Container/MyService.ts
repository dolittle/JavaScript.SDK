// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { inject } from 'inversify';
import { Logger } from 'winston';

export class MyService {
    constructor(@inject('Logger') private readonly _logger: Logger) {
        this._logger.info('Constructing MyService');
    }

    doStuff() {
        this._logger.info('Doing stuff in the Service');
    }
}
