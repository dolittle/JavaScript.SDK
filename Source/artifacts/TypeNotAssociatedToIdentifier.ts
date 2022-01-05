// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';

/**
 * Exception that gets thrown when getting identifier associated with a type and type is not associated to any identifier.
 */
export class TypeNotAssociatedToIdentifier extends Exception {
    /**
     * Initializes a new instance of {@link TypeNotAssociatedToIdentifier}.
     * @param {string} identifierTypeName - The name of the identifier type.
     * @param {Function} type - Type that has a missing association.
     */
    constructor(identifierTypeName: string, type: Function) {
        super(`'${type.name}' does not have an ${identifierTypeName} association.`);
    }
}
