// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Artifact } from './Artifact';

/**
 * Defines the system for working with {Artifact}
 */
export interface IArtifacts {

    /**
     * Check if there is an {Artifact} definition for a given type.
     * @param {Function} type Type to check for.
     * @returns true if there is, false if not.
     */
    hasFor(type: Function): boolean;

    /**
     * Get {Artifact} definition for a given type.
     * @param {Function} type Type to get for.
     * @returns {Artifact} The artifact associated.
     */
    getFor(type: Function): Artifact;
}
