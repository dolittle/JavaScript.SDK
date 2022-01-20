// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { FailureReason } from '@dolittle/sdk.protobuf';

/**
 * The exception that gets thrown when the handshake with the Runtime fails.
 */
export class RuntimeHandshakeFailed extends Error {
    /**
     * Initialises a new instance of the {@link RuntimeHandshakeFailed} class.
     * @param {FailureReason} reason - The reason why the handshake failed.
     */
    constructor(reason: FailureReason) {
        super(`Runtime handhshake failed beacause ${reason.value}`);
    }
}
