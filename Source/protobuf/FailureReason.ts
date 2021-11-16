// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';

/**
 * Represents the reason for a {Failure}.
 */
export class FailureReason extends ConceptAs<string, '@dolittle/sdk.protobuf.FailureReason'> {
    /**
     * Initialises a new instance of the {@link FailureReason} class.
     * @param {string} reason - The failure reason.
     */
    constructor(reason: string) {
        super(reason, '@dolittle/sdk.protobuf.FailureReason');
    }

    /**
     * Creates a {@link FailureReason} from a string.
     * @param {string} reason - The failure reason.
     * @returns {FailureReason} The failure reason concept.
     */
    static from(reason: string): FailureReason {
        return new FailureReason(reason);
    }
}
