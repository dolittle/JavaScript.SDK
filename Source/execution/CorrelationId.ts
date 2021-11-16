// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { ConceptAs } from '@dolittle/concepts';

/**
 * A unique identifier to allow us to trace actions and their consequences throughout the system.
 */
export class CorrelationId extends ConceptAs<Guid, '@dolittle/sdk.execution.CorrelationId'> {
    constructor(id: Guid) {
        super(id, '@dolittle/sdk.execution.CorrelationId');
    }

    /**
     * Represents the system correlation identifier.
     */
    static system = CorrelationId.from('868ff40f-a133-4d0f-bfdd-18d726181e01');

    /**
     * Creates a {CorrelationId} from a guid.
     *
     * @static
     * @param {CorrelationId | Guid | string} id
     * @returns {CorrelationId}
     */
    static from(id: CorrelationId | Guid | string): CorrelationId {
        if (id instanceof CorrelationId) {
            return id;
        }
        return new CorrelationId(Guid.as(id));
    };

    /**.
     * Creates a new {CorrelationId}
     *
     * @static
     * @returns {CorrelationId}
     */
    static new(): CorrelationId {
        return CorrelationId.from(Guid.create());
    }
}
