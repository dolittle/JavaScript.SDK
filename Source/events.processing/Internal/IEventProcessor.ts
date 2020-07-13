// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Observable } from 'rxjs';

import { Cancellation } from '@dolittle/sdk.services';

/**
 * Defines a system that handles the behaviour of event processors that registers with the Runtime and handles processing requests.
 */
export interface IEventProcessor {
    /**
     * Registers the event processor with the Runtime, and if successful starts handling requests.
     * @param {Cancellation} cancellation Used to cancel the registration and processing.
     * @returns {Observable} Representing the connection to the Runtime.
     */
    register(cancellation: Cancellation): Observable<never>;

    registerWithPolicy(cancellation: Cancellation): Observable<never>;

    registerForeverWithPolicy(cancellation: Cancellation): Observable<never>;
}

