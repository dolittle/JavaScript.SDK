// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Cancellation, RetryPolicy } from '@dolittle/sdk.resilience';
import { Observable } from 'rxjs';

/**
 * Defines a system that handles the behavior of event processors that registers with the Runtime and handles processing requests.
 */
export abstract class IEventProcessor {
    /**
     * Registers the event processor with the Runtime, and if successful starts handling requests.
     * @param {Cancellation} cancellation Used to cancel the registration and processing.
     * @returns {Observable} Representing the connection to the Runtime.
     */
    abstract register (cancellation: Cancellation): Observable<never>;

    abstract registerWithPolicy (policy: RetryPolicy, cancellation: Cancellation): Observable<never>;

    abstract registerForeverWithPolicy (policy: RetryPolicy, cancellation: Cancellation): Observable<never>;
}
