// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { ScopeId } from '@dolittle/sdk.events';
import { Failure } from '@dolittle/sdk.protobuf';
import { ProjectionId, Key  } from '..';

/**
 * An exception that gets thrown when a projection fails to be getted.
 */
export class FailedToGetProjection extends Exception {
    constructor(projection: ProjectionId, scope: ScopeId, key: Key | undefined, failure: Failure) {
        if (key) {
            super(`Failed to get projection ${projection} in scope ${scope} with key ${key} due to failure ${failure.id} with reason: ${failure.reason}`);
        } else {
            super(`Failed to get projection ${projection} in scope ${scope} due to failure ${failure.id} with reason: ${failure.reason}`);
        }
    }
}
