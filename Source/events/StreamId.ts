// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { ConceptAs } from '@dolittle/concepts';

/**
 * Represents the unique identifier of a stream.
 */
export class StreamId extends ConceptAs<Guid, '@dolittle/sdk.events.StreamId'> {
    /**
     * Initialises a new instance of the {@link StreamId} class.
     * @param {Guid} id - The stream id.
     */
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
     * Creates a {@link StreamId} from a {@link Guid} or a {@link string}.
     * @param {Guid | string} id - The stream id.
     * @returns {StreamId} The created stream id concept.
     */
    static from(id: string | Guid | StreamId): StreamId {
        if (id instanceof StreamId) return id;
        return new StreamId(Guid.as(id));
    }
};
