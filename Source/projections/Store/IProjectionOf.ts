// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Cancellation } from '@dolittle/sdk.resilience';
import { Key } from '../Key';
import { CurrentState } from './CurrentState';
import { ScopedProjectionId } from './ScopedProjectionId';

/**
 * Defines a system that knows about a projection.
 * @template TReadModel The type of the projection read model.
 */
export abstract class IProjectionOf<TReadModel> {
    /**
     * Gets the {@link ScopedProjectionId} identifier;.
     */
    abstract readonly identifier: ScopedProjectionId;

    /**
     * Gets the projection read model by key.
     * @param key - The key of the projection.
     * @param cancellation - The cancellation token.
     */
    abstract get(key: Key | any, cancellation?: Cancellation): Promise<TReadModel>;

    /**
     * Gets the projection state by key.
     * @param key - The key of the projection.
     * @param cancellation - The cancellation token.
     */
    abstract getState(key: Key | any, cancellation?: Cancellation): Promise<CurrentState<TReadModel>>;

    /**
     * Gets all projection read models.
     * @param cancellation - The cancellation token.
     */
    abstract getAll(cancellation?: Cancellation): Promise<TReadModel[]>;
}
