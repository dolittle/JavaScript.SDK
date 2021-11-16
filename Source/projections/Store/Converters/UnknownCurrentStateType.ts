// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { ProjectionCurrentStateType } from '@dolittle/runtime.contracts/Projections/State_pb';

/**
 * Exception that gets thrown when trying to use a {@link ProjectionCurrentStateType} that is unknown.
 */
export class UnknownCurrentStateType extends Exception {
    /**
     * Initialises a new instance of the {@link UnknownCurrentStateType} class.
     * @param {ProjectionCurrentStateType} type - The current state type that is not known.
     */
    constructor(type: ProjectionCurrentStateType) {
        super(`Unknown current state type ${type}`);
    }
}
