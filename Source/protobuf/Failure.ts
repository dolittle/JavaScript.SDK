// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

/**
 * Represents a unique failure that occurred when performing operations with the runtime.
 */
export class Failure {

    /**
     * Initializes an instance of failure.
     * @param {Guid} id Unique identifier of the failure.
     * @param {string} reason Reason for failing
     */
    constructor(readonly id: Guid, readonly reason: string) {
    }
}
