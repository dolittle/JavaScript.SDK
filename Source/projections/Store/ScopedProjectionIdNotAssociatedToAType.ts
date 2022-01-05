// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';

import { ScopedProjectionId } from './ScopedProjectionId';

/**
 * Exception that gets thrown when getting the type associated with an identifier and the identifier is not associated to any type.
 */
export class ScopedProjectionIdNotAssociatedToAType extends Exception {
    /**
     * Initializes a new instance of the {@link ScopedProjectionIdNotAssociatedToAType} class.
     * @param {ScopedProjectionId} identifier - The identifier that has a missingi association.
     */
    constructor(identifier: ScopedProjectionId) {
        super(`The projection '${identifier.projectionId}' in scope '${identifier.scopeId}' does not have a type associated.`);
    }
}
