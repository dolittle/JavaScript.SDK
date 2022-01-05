// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';
import { Exception, Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

/**
 * Exception that gets thrown when an type is associated with multiple identifiers.
 * @template TId The type of the identifier.
 */
export class CannotHaveMultipleIdentifiersAssociatedWithType<TId extends ConceptAs<Guid, string>> extends Exception {
    /**
     * Initialises a new instance of the {@link CannotHaveMultipleIdentifiersAssociatedWithType} class.
     * @param {Constructor<any>} type - The type that already associated with an identifier.
     * @param {TId} identifier - The identifier that was attempted to associate with.
     * @param {TId} associatedIdentifier - The identifier that the type was already associated with.
     */
    constructor(type: Constructor<any>, identifier: TId, associatedIdentifier: TId) {
        super(`${type.name} cannot be associated with ${identifier} because it is already associated with ${associatedIdentifier}`);
    }
}
