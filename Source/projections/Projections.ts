// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { Cancellation } from '@dolittle/sdk.resilience';
import { IProjections } from './IProjections';
import { Projection } from './Projection';

/**
 * Represents an implementation of {IProjections}
 */
export class Projections implements IProjections {

    /**
     * Initializes an instance of {@link Projections}.
     * @param {Logger} _logger For logging.
     */
    constructor(private readonly _logger: Logger) {
    }

    /** @inheritdoc */
    register(projection: Projection, cancellation?: Cancellation): void {
        throw new Error('Method not implemented.');
    }
}
