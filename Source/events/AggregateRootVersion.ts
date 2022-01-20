// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';

/**
 * Represents a version of an aggregate root as a natural number, corresponding to the number of events the Aggregate Root has applied to an Event Source.
 */
export class AggregateRootVersion extends ConceptAs<number, '@dolittle/sdk.aggregates.AggregateRoot'> {

    /**
     * The initial version of an aggregate root that has applied no events.
     */
    static initial: AggregateRootVersion = AggregateRootVersion.from(0);

    /**
     * Initializes an instance of {@link AggregateRootVersion}.
     * @param {number} value - The version number.
     */
    constructor(value: number) {
        super(value, '@dolittle/sdk.aggregates.AggregateRoot');
    }

    /**
     * Get the next version number.
     * @returns {AggregateRootVersion} The next aggregate root version number.
     */
    next(): AggregateRootVersion {
        return new AggregateRootVersion(this.value + 1);
    }

    /**.
     * Creates an {@link AggregateRootVersion} from a {@link number}.
     * @param {number | AggregateRootVersion} value - The version to create from
     * @returns {AggregateRootVersion} The created aggregate root version concept.
     */
    static from(value: number | AggregateRootVersion): AggregateRootVersion {
        return new AggregateRootVersion(value instanceof AggregateRootVersion ? value.value : value);
    }
}
