// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { ConceptAs } from '@dolittle/concepts';

/**
 * A unique identifier to allow us to trace actions and their consequences throughout the system.
 */
export class CorrelationId extends ConceptAs<Guid, '@dolittle/sdk.execution.CorrelationId'> {
    /**
     * Initialises a new instance of the {@link CorrelationId} class.
     * @param {Guid} id - The correlation id.
     */
    constructor(id: Guid) {
        super(id, '@dolittle/sdk.execution.CorrelationId');
    }

    /**
     * Represents the system correlation identifier.
     */
    static system = CorrelationId.from('868ff40f-a133-4d0f-bfdd-18d726181e01');

    /**
     * Creates a {@link CorrelationId} from a {@link Guid} or a {@link string}.
     * @param {CorrelationId | Guid | string} id - The correlation id.
     * @returns {CorrelationId} The created correlation id concept.
     */
    static from(id: CorrelationId | Guid | string): CorrelationId {
        if (id instanceof CorrelationId) {
            return id;
        }
        return new CorrelationId(Guid.as(id));
    };

    /**.
     * Generates a new {@link CorrelationId}
     * @returns {CorrelationId} A new random correlation id.
     */
    static new(): CorrelationId {
        return CorrelationId.from(Guid.create());
    }
}
