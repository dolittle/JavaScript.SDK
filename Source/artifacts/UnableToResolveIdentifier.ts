// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';

/**
 * Exception that is thrown when it is not possible to resolve the identifier from an object.
 */
export class UnableToResolveIdentifier extends Exception {

    /**
     * Initializes a new instance of {@link UnableToResolveIdentifier}.
     * @param {string} identifierTypeName - The name of the identifier type.
     * @param {any} object - The object that was attempted to resolve the event from.
     */
    constructor(identifierTypeName: string, object: any) {
        super(`'${Object.getPrototypeOf(object).constructor.name}' does not have an associated ${identifierTypeName}.`);
    }
}
