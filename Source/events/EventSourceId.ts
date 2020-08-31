// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { ConceptAs } from '@dolittle/concepts';

export class EventSourceId extends ConceptAs<Guid, '@dolittle/sdk.events.EventSourceId'> {
    constructor(id: Guid) {
        super(id, '@dolittle/sdk.events.EventSourceId');
    }
    /**
     * Creates an {EventSourceId} from a guid.
     *
     * @static
     * @param {(Guid | string)} id
     * @returns {EventSourceId}
     */
    static from(id: Guid | string): EventSourceId {
        return new EventSourceId(Guid.as(id));
    }
};
