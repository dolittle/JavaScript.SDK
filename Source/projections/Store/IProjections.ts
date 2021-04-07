// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Cancellation } from '@dolittle/sdk.resilience';
import { Constructor } from '@dolittle/types';
import { Key } from '..';
import { CurrentState } from './CurrentState';

/**
 * Defines teh API sutface for getting projections.
 */
export interface IProjections {
    /**
     * Gets a projection state.
     * @template T
     * @param {Constructor<T>} type The type of the projection.
     * @param {Key} key The key of the projection.
     * @param {Cancellation} [cancellation] The cancellation token.
     * @returns {Promise<CurrentState<TPRojection>>}
     */
    get<TProjection>(type: Constructor<TProjection>, key: Key, cancellation?: Cancellation): Promise<CurrentState<TProjection>>;

    /**
     * Gets all projection states.
     * @template T
     * @param {Constructor<T>} type The type of the projection.
     * @param {Cancellation} [cancellation] The cancellation token.
     * @returns {Promise<CurrentState<TPRojection>>}
     */
    getAll<TProjection>(type: Constructor<TProjection>, cancellation?: Cancellation): Promise<CurrentState<TProjection>[]>;
}
