// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { FailureId } from './FailureId';
import { FailureReason } from './FailureReason';

/**
 * Represents a unique failure that occurred when performing operations with the runtime.
 */
export class Failure {

    /**
     * Initializes an instance of failure.
     * @param {Failure} id - Unique identifier of the failure.
     * @param {FailureReason} reason - Reason for failing.
     */
    constructor(readonly id: FailureId, readonly reason: FailureReason) {
    }

    /**
     * Creates a {Failure} from a guid and a string.
     *
     * @static
     * @param {(Guid | string)} id
     * @param {string} reason
     * @returns
     */
    static from(id: Guid | string, reason: string) {
        return new Failure(FailureId.from(id), FailureReason.from(reason));
    }
}
