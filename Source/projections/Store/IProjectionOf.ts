// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { Abstract, ServiceIdentifier } from '@dolittle/sdk.dependencyinversion';
import { Cancellation } from '@dolittle/sdk.resilience';
import { ScopeId } from '@dolittle/sdk.events';

import { Key } from '../Key';
import { CurrentState } from './CurrentState';
import { ProjectionId } from '../ProjectionId';

/**
 * Defines a system that knows about a projection.
 * @template TReadModel The type of the projection read model.
 */
export abstract class IProjectionOf<TReadModel> {
    /**
     * Gets the {@link ProjectionId} identifier.
     */
    abstract readonly identifier: ProjectionId;

    /**
     * Gets the {@link ScopeId}.
     */
    abstract readonly scope: ScopeId;

    /**
     * Gets the projection read model by key.
     * @param {Key | any} key - The key of the projection.
     * @param {Cancellation} [cancellation] - The optional cancellation token.
     * @returns {Promise<TReadModel>} A {@link Promise} that when resolved returns the read model of the projection.
     */
    abstract get(key: Key | any, cancellation?: Cancellation): Promise<TReadModel>;

    /**
     * Gets the projection state by key.
     * @param {Key | any} key - The key of the projection.
     * @param {Cancellation} [cancellation] - The optional cancellation token.
     * @returns {Promise<CurrentState<TReadModel>>} A {@link Promise} that when resolved returns the current state of the projection.
     */
    abstract getState(key: Key | any, cancellation?: Cancellation): Promise<CurrentState<TReadModel>>;

    /**
     * Gets all projection read models.
     * @param {Cancellation} [cancellation] - The optional cancellation token.
     * @returns {Promise<TReadModel>} A {@link Promise} that when resolved returns all the read models of the projection.
     */
    abstract getAll(cancellation?: Cancellation): Promise<TReadModel[]>;

    /**
     * Gets a {@link ServiceIdentifier} for a Projection read model type to inject an {@link IProjectionOf} from the service provider.
     * @param {Constructor} type - The type of the projection read model.
     * @returns {Abstract} The service identifier to use for injection.
     */
    static for<TReadModel>(type: Constructor<TReadModel>): Abstract<IProjectionOf<TReadModel>> {
        return `IProjectionOf<${type.name}>` as any;
    }
}
