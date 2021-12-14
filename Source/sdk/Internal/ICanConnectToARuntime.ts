// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Cancellation } from '@dolittle/sdk.resilience';

import { ConnectionResult } from './ConnectionResult';

/**
 * Defines a system that can perform the initial connection to a Dolittle Runtime.
 */
export abstract class ICanConnectToARuntime {
    /**
     * Performs the initial connection to the Runtime.
     * @param {Cancellation} [cancellation] - An optional cancellelation to stop the connection.
     * @returns {Promise<ConnectionResult>} A promise that, when resolved returns the connection result.
     */
    abstract connect(cancellation?: Cancellation): Promise<ConnectionResult>;
}
