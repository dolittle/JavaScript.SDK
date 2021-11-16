// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ScopeId } from '@dolittle/sdk.events';
import { ProjectionId } from '../';

/**
 * Represents the identifier for an associated projection.
 */
export class ProjectionAssociation {
    /**
     * Initializes a new instance of a {@link ProjectionAssociation}.
     * @param {ProjectionId} identifier - The id of the projection.
     * @param {ScopeId} scopeId - The scope the projection is in.
     */
    constructor(readonly identifier: ProjectionId, readonly scopeId: ScopeId) { }
}
