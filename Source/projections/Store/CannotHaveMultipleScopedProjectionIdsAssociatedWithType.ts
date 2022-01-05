// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { ScopedProjectionId } from './ScopedProjectionId';

/**
 * Exception that gets thrown when an type is associated with multiple identifiers.
 */
export class CannotHaveMultipleScopedProjectionIdsAssociatedWithType extends Exception {
    /**
     * Initialises a new instance of the {@link CannotHaveMultipleScopedProjectionIdsAssociatedWithType} class.
     * @param {Constructor<any>} type - The type that already associated with an identifier.
     * @param {ScopedProjectionId} identifier - The identifier that was attempted to associate with.
     * @param {ScopedProjectionId} associatedIdentifier - The identifier that the type was already associated with.
     */
    constructor(type: Constructor<any>, identifier: ScopedProjectionId, associatedIdentifier: ScopedProjectionId) {
        super(`${type.name} cannot be associated with ${identifier} because it is already associated with ${associatedIdentifier}`);
    }
}
