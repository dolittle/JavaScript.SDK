// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Key } from '..';
import { CurrentStateType } from './CurrentStateType';

/**
 * Represents the current projection state.
 */
export class CurrentState<TProjection> {

    /**
     * Creates an instance of a projections current state.
     * @param {CurrentStateType} type - The type of the projections current state.
     * @param {TProjection} state - State of the projection.
     * @param {Key} key - The key of the projection.
     * @template TProjection The type of the projection.
     */
    constructor(readonly type: CurrentStateType, readonly state: TProjection, readonly key: Key) {}
}
