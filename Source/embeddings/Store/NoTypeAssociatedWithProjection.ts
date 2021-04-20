// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { ScopeId } from '@dolittle/sdk.events';
import { ProjectionId } from '../ProjectionId';

/**
 * Exception that gets thrown when trying to get a type that isn't associated to a projection.
 */
export class NoTypeAssociatedWithProjection extends Exception {
    constructor(projection: ProjectionId, scope: ScopeId) {
        super(`No type associated with projection ${projection} in scope ${scope}`);
    }
}
