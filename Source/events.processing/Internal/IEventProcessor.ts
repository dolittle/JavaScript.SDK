// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Observable } from 'rxjs';

import { Cancellation, RetryPolicy } from '@dolittle/sdk.resilience';

/**
 * Defines a system that handles the behavior of event processors that registers with the Runtime and handles processing requests.
 */
export interface IEventProcessor {

    registerWithPolicy(policy: RetryPolicy, cancellation: Cancellation): Observable<never>;

    registerForeverWithPolicy(policy: RetryPolicy, cancellation: Cancellation): Observable<never>;
}
