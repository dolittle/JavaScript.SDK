// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ProjectionCurrentState } from '@dolittle/runtime.contracts/Events.Processing/Projections_pb';
import { CurrentState } from '..';

/**
 * Defines a system that is capable of converting projections to SDK.
 */
export interface IConvertProjectionsToSDK
{
    /**
     * Convert from the runtime respresentation to the SDK's representation of the current state of a projection.
     * @param {string} source The JSON string to convert.
     */
    convert<TProjection>(source: ProjectionCurrentState): CurrentState<TProjection>;
    /**
     * Convert from an array of runtime respresentations of the current state of a projection to the SDK's representation.
     * @param {string} source The JSON string to convert.
     */
    convertAll<TProjection>(sourceArray: ProjectionCurrentState[]): CurrentState<TProjection>[];
}
