// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { CurrentStateType } from './CurrentStateType';

/**
 * Represents the current projection state.
 */
export class CurrentState<TProjection> {

    /**
     * Creates an instance of a projections current state.
     * @template T
     * @param {CurrentStateType} type The type of the projections current state.
     * @param {TProjection} state State of the projection.
     */
    constructor(readonly type: CurrentStateType, readonly state: TProjection) {}
}
