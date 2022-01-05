// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';
import { Exception, Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

/**
 * Exception that gets thrown when an identifier is associated with multiple types.
 * @template TId The type of the identifier.
 */
export class CannotHaveMultipleTypesAssociatedWithIdentifier<TId extends ConceptAs<Guid, string>> extends Exception {
    /**
     * Initialises a new instance of the {@link CannotHaveMultipleTypesAssociatedWithIdentifier} class.
     * @param {TId} identifier - The identifier that was already associated with at type.
     * @param {Constructor<any>} type - The type that was attempted to associate with.
     * @param {Constructor<any>} associatedType - The type that the identifier was already associated with.
     */
    constructor(identifier: TId, type: Constructor<any>, associatedType: Constructor<any>) {
        super(`${identifier} cannot be associated with ${type.name} because it is already associated with ${associatedType}`);
    }
}
