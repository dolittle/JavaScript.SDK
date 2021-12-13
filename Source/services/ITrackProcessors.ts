// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Cancellation } from '@dolittle/sdk.resilience';
import { Subscription } from 'rxjs';

/**
 * Defines a system that can keep track of running processors and wait for all to complete.
 */
export abstract class ITrackProcessors {
    /**
     * Registers a processor to track.
     * This will cause any waiter to block until completion of this processor.
     * @param {Subscription} processor - The subscription that represents a processor.
     */
    abstract registerProcessor(processor: Subscription): void;

    /**
     * Gets a promise that is resolved when all registered processors are completed.
     * @param {Cancellation} [cancellation] - An optional cancellation to cancel the waiting.
     * @returns {Promise<void>} A promise that is resolved once all registered processors are completed, or rejected if cancelled.
     */
    abstract allProcessorsCompleted(cancellation?: Cancellation): Promise<void>;
}
