// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';

/**
 * Exception that gets thrown when getting identifier associated with a type and type is not associated to a projection and scope identifier.
 */
export class TypeNotAssociatedToScopedProjectionId extends Exception {
    /**
     * Initializes a new instance of {@link TypeNotAssociatedToScopedProjectionId}.
     * @param {Function} type - Type that has a missing association.
     */
    constructor(type: Function) {
        super(`'${type.name}' does not have an association to a projection and scope id.`);
    }
}
