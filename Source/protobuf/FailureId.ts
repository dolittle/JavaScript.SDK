// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';
import { Guid } from '@dolittle/rudiments';

/**
 * Represents the unique identifier for a {Failure}.
 */
export class FailureId extends ConceptAs<Guid, '@dolittle/sdk.protobuf.FailureId'> {
    /**
     * Initialises a new instance of the {@link FailureId} class.
     * @param {Guid} id - The failure id.
     */
    constructor(id: Guid) {
        super(id, '@dolittle/sdk.protobuf.FailureId');
    }

    /**
     * Creates a {@link FailureId} from a {@link Guid} or a {@link string}.
     * @param {string | Guid} id - The failure id.
     * @returns {FailureId} The failure id concept.
     */
    static from(id: string | Guid): FailureId {
        return new FailureId(Guid.as(id));
    };
}
