// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';
import { Guid } from '@dolittle/rudiments';

/**
 * Represents the unique identifier for a {Failure}.
 */
export class FailureId extends ConceptAs<Guid, '@dolittle/sdk.protobuf.FailureId'> {
    /**
     * @param id
     */
    constructor(id: Guid) {
        super(id, '@dolittle/sdk.protobuf.FailureId');
    }

    /**
     * Creates a {FailureId} from a guid.
     * @param {(string | Guid)} id - The failure id.
     * @returns {FailureId} The failure id concept.
     */
    static from(id: string | Guid): FailureId {
        return new FailureId(Guid.as(id));
    };
}
