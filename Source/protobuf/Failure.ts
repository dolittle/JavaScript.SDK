// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { FailureId, FailureReason } from './internal';

/**
 * Represents a unique failure that occurred when performing operations with the runtime.
 */
export class Failure {

    /**
     * Initializes an instance of failure.
     * @param {Failure} id Unique identifier of the failure.
     * @param {FailureReason} reason Reason for failing
     */
    constructor(readonly id: FailureId, readonly reason: FailureReason) {
    }
}
