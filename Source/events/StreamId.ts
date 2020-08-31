// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { ConceptAs } from '@dolittle/concepts';

/**
 * Represents the unique identifier of a stream.
 */
export class StreamId extends ConceptAs<Guid, '@dolittle/sdk.events.StreamId'> {
    constructor(id: Guid) {
        super(id, '@dolittle/sdk.events.StreamId');
    }

    /**
     * Represents the event log.
     *
     * @static
     * @type {StreamId}
     */
    static eventLog: StreamId = StreamId.from(Guid.empty);

    /**
     * Creates a {StreamId} from a guid.
     *
     * @static
     * @param {(Guid | string)} id
     * @returns {StreamId}
     */
    static from(id: Guid | string): StreamId {
        return new StreamId(Guid.as(id));
    }
};
