// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Cancellation } from '@dolittle/sdk.resilience';
import { Key } from '..';
import { CurrentState } from './CurrentState';

export class Projections {

    constructor(
        private readonly _logger) {}

    get<TProjection>(key: Key, cancellation: Cancellation = Cancellation.default): Promise<CurrentState> {

    }

    getAll<TProjection>(cancellation: Cancellation = Cancellation.default): Promise<CurrentState[]> {

    }
}
