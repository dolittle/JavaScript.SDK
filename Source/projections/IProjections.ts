// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Cancellation } from '@dolittle/sdk.resilience';

import { Projection } from './Projection';

/**
 * Defines the system for projections
 */
export interface IProjections {

    /**
     * Register a a projection
     * @param {Projection} projection Projection to register
     * @param {Cancellation} cancellation Used to close the connection to the Runtime.
     */
    register(projection: Projection, cancellation?: Cancellation): void;
}
