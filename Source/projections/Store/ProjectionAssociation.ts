// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ScopeId } from '@dolittle/sdk.events';

import { ProjectionId } from '../ProjectionId';

/**
 * Identifies a projection associated with a class.
 */
export type ProjectionAssociation = {
    readonly identifier: ProjectionId;
    readonly scope: ScopeId;
};
