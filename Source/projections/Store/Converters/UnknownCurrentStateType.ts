// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { ProjectionCurrentStateType } from '@dolittle/runtime.contracts/Events.Processing/Projections_pb';

export class UnknownCurrentStateType extends Exception {
    constructor(type: ProjectionCurrentStateType) {
        super(`Unknown current state type ${type}`);
    }
}
