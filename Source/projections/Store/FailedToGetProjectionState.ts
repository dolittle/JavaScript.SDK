// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { ScopeId } from '@dolittle/sdk.events';
import { Key, ProjectionId } from '..';


export class FailedToGetProjectionState extends Exception {
    constructor(projection: ProjectionId, scope: ScopeId, key: Key) {
        super(`Failed to get projection ${projection} in scope ${scope} with key ${key}. No state returned for projection.`);
    }
}
