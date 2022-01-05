// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';
import { Exception, Guid } from '@dolittle/rudiments';

/**
 * Exception that gets thrown when getting the type associated with an identifier and the identifier is not associated to any type.
 * @template TId The type of the identifier.
 */
export class IdentifierNotAssociatedToAType<TId extends ConceptAs<Guid, string>> extends Exception {
    /**
     * Initializes a new instance of the {@link IdentifierNotAssociatedToAType} class.
     * @param {TId} identifier - Identifier that has a missing association.
     */
    constructor(identifier: TId) {
        super(`'${identifier}' does not have a type associated.`);
    }
}
