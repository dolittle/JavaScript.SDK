// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ScopeId } from '@dolittle/sdk.events';
import { Constructor } from '@dolittle/types';

import { ProjectionId } from '..';

/**
 * Represents a projection created from the decorator
 */
export class ProjectionDecoratedType {
    constructor(
        readonly projectionId: ProjectionId,
        readonly scopeId: ScopeId,
        readonly type: Constructor<any>) {
    }
}
