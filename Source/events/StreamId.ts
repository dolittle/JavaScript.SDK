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
    static create(id?: Guid | string): StreamId {
        return new StreamId(id != null ? Guid.as(id) : Guid.create());
    }
};

