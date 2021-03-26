// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Cancellation } from '@dolittle/sdk.resilience';
import { ProjectionProcessor } from './Internal';

import { Projection } from './Projection';

/**
 * Defines the system for projections
 */
export interface IProjections {

    /**
     * Register a a projection
     * @template T Type of the readmodel.
     * @param {ProjectionProcessor} projectionProcessor Projection processor to register.
     * @param {Cancellation} cancellation Used to close the connection to the Runtime.
     */
    register<T>(projectionProcessor: ProjectionProcessor<T>, cancellation?: Cancellation): void;
}
