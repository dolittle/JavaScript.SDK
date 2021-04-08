// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { ProjectionCurrentState } from '@dolittle/runtime.contracts/Projections/State_pb';

import { Key } from '../..';
import { CurrentState } from '..';

/**
 * Defines a system that converts projections to SDK representations.
 */
export interface IConvertProjectionsToSDK
{
    /**
     * Convert from the runtime respresentation to the SDK's representation of the current state of a projection.
     * @param {Constructor<TProjection> | undefined} type The optional read model type to convert to.
     * @param {ProjectionCurrentState} source The current state to convert.
     */
    convert<TProjection = any>(type: Constructor<TProjection> | undefined, source: ProjectionCurrentState): CurrentState<TProjection>;

    /**
     * Convert from an list of runtime respresentations of the current state of a projection to the SDK's representation.
     * @param {Constructor<TProjection> | undefined} type The optional read model type to convert to.
     * @param {ProjectionCurrentState[]} sources A list of states to convert.
     */
    convertAll<TProjection = any>(type: Constructor<TProjection> | undefined, sources: ProjectionCurrentState[]): Map<Key, CurrentState<TProjection>>;
}
