// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Observable } from 'rxjs';
import { Logger } from 'winston';

import { Cancellation, RetryPolicy } from '@dolittle/sdk.resilience';

/**
 * Defines a system that handles the behavior of event processors that registers with the Runtime and handles processing requests.
 */
export abstract class IEventProcessor {
    /**
     * Registers the event processor with the Runtime, and if successful starts handling requests.
     * @param {Logger} logger - Used for logging.
     * @param {Cancellation} cancellation - Used to cancel the registration and processing.
     * @returns {Observable} Representing the connection to the Runtime.
     */
    abstract register(logger: Logger, cancellation: Cancellation): Observable<void>;

    /**
     * Registers a processor with a policy.
     * @param {RetryPolicy} policy - The policy to register with.
     * @param {Logger} logger - Used for logging.
     * @param {Cancellation} cancellation - The cancellation.
     * @returns {Observable} Repressenting the connection to the Runtime.
     */
    abstract registerWithPolicy(policy: RetryPolicy, logger: Logger, cancellation: Cancellation): Observable<void>;

    /**
     * Registers a processor forever with a policy. Even if the registration completes, the repeat() call
     * will try to re-register.
     * @param {RetryPolicy} policy - The policy to register with.
     * @param {Logger} logger - Used for logging.
     * @param {Cancellation} cancellation - The cancellation.
     * @returns {Observable} Repressenting the connection to the Runtime.
     */
    abstract registerForeverWithPolicy(policy: RetryPolicy, logger: Logger, cancellation: Cancellation): Observable<void>;
}
