// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { ScopeId } from '@dolittle/sdk.events';
import { Cancellation } from '@dolittle/sdk.resilience';

import { Key } from '../Key';
import { ProjectionId } from '../ProjectionId';
import { CurrentState } from './CurrentState';

/**
 * Defines the API surface for getting projections.
 */
export abstract class IProjectionStore {
    /**
     * Gets a projection read model by key for a projection associated with a type.
     * @param {Constructor<TProjection>} type - The type of the projection.
     * @param {Key | any} key - The key of the projection.
     * @param {Cancellation} [cancellation] - The cancellation token.
     * @returns {Promise<TProjection>} A {@link Promise} that when resolved returns the read model of the projection.
     * @template TProjection The type of the projection.
     */
    abstract get<TProjection>(type: Constructor<TProjection>, key: Key | any, cancellation?: Cancellation): Promise<TProjection>;

    /**
     * Gets a projection read model by key for a projection specified by projection identifier.
     * @param {Constructor<TProjection>} type - The type of the projection.
     * @param {Key | any} key - The key of the projection.
     * @param {ProjectionId | Guid | string} projection - The id of the projection.
     * @param {Cancellation} [cancellation] - The cancellation token.
     * @returns {Promise<TProjection>} A {@link Promise} that when resolved returns the read model of the projection.
     * @template TProjection The type of the projection.
     */
    abstract get<TProjection>(type: Constructor<TProjection>, key: Key | any, projection: ProjectionId | Guid | string, cancellation?: Cancellation): Promise<TProjection>;

    /**
     * Gets a projection read model by key for a projection specified by projection and scope identifier.
     * @param {Constructor<TProjection>} type - The type of the projection.
     * @param {Key | any} key - The key of the projection.
     * @param {ProjectionId | Guid | string} projection - The id of the projection.
     * @param {ScopeId | Guid | string} scope - The scope the projection in.
     * @param {Cancellation} [cancellation] - The cancellation token.
     * @returns {Promise<TProjection>} A {@link Promise} that when resolved returns the read model of the projection.
     * @template TProjection The type of the projection.
     */
    abstract get<TProjection>(type: Constructor<TProjection>, key: Key | any, projection: ProjectionId | Guid | string, scope: ScopeId | Guid | string, cancellation?: Cancellation): Promise<TProjection>;

    /**
     * Gets a projection read model by key for a projection specified by projection identifier.
     * @param {Key | any} key - The key of the projection.
     * @param {ProjectionId | Guid | string} projection - The id of the projection.
     * @param {Cancellation} [cancellation] - The cancellation token.
     * @returns {Promise<any>} A {@link Promise} that when resolved returns the read model of the projection.
     */
    abstract get(key: Key | any, projection: ProjectionId | Guid | string, cancellation?: Cancellation): Promise<any>;

    /**
     * Gets a projection read model by key for a projection specified by projection and scope identifier.
     * @param {Key | any} key - The key of the projection.
     * @param {ProjectionId | Guid | string} projection - The id of the projection.
     * @param {ScopeId | Guid | string} scpåe - The scope the projection in.
     * @param {Cancellation} [cancellation] - The cancellation token.
     * @returns {Promise<any>} A {@link Promise} that when resolved returns the read model of the projection.
     */
    abstract get(key: Key | any, projection: ProjectionId | Guid | string, scope: ScopeId | Guid | string, cancellation?: Cancellation): Promise<any>;

    /**
     * Gets all projection read models for a projection associated with a type.
     * @template T
     * @param {Constructor<T>} type - The type of the projection.
     * @param {Cancellation} [cancellation] - The cancellation token.
     * @returns {Promise<TProjection[]>} A {@link Promise} that when resolved returns the all the read models of the projection.
     * @template TProjection The type of the projection.
     */
    abstract getAll<TProjection>(type: Constructor<TProjection>, cancellation?: Cancellation): Promise<TProjection[]>;

    /**
     * Gets all projection read models for a projection specified by projection identifier.
     * @param {Constructor<TProjection>} type - The type of the projection.
     * @param {ProjectionId | Guid | string} projection - The id of the projection.
     * @param {Cancellation} [cancellation] - The cancellation token.
     * @returns {Promise<TProjection[]>} A {@link Promise} that when resolved returns the all the read models of the projection.
     * @template TProjection The type of the projection.
     */
    abstract getAll<TProjection>(type: Constructor<TProjection>, projection: ProjectionId | Guid | string, cancellation?: Cancellation): Promise<TProjection[]>;

    /**
     * Gets all projection read models for a projection specified by projection and scope identifier.
     * @param {Constructor<TProjection>} type - The type of the projection.
     * @param {ProjectionId | Guid | string} projection - The id of the projection.
     * @param {ScopeId | Guid | string} scope - The scope the projection in.
     * @param {Cancellation} [cancellation] - The cancellation token.
     * @returns {Promise<TProjection[]>} A {@link Promise} that when resolved returns the all the read models of the projection.
     * @template TProjection The type of the projection.
     */
    abstract getAll<TProjection>(type: Constructor<TProjection>, projection: ProjectionId | Guid | string, scope: ScopeId | Guid | string, cancellation?: Cancellation): Promise<TProjection[]>;

    /**
     * Gets all projection read models for a projection specified by projection identifier.
     * @param {ProjectionId | Guid | string} projection - The id of the projection.
     * @param {Cancellation} [cancellation] - The cancellation token.
     * @returns {Promise<any[]>} A {@link Promise} that when resolved returns the all the read models of the projection.
     */
    abstract getAll(projection: ProjectionId | Guid | string, cancellation?: Cancellation): Promise<any[]>;

    /**
     * Gets all projection read models for a projection specified by projection and scope identifier.
     * @param {ProjectionId | Guid | string} projection - The id of the projection.
     * @param {ScopeId | Guid | string} scope - The scope the projection in.
     * @param {Cancellation} [cancellation] - The cancellation token.
     * @returns {Promise<any[]>} A {@link Promise} that when resolved returns the all the read models of the projection.
     */
    abstract getAll(projection: ProjectionId | Guid | string, scope: ScopeId | Guid | string, cancellation?: Cancellation): Promise<any[]>;

    /**
     * Gets a projection state by key for a projection associated with a type.
     * @param {Constructor<TProjection>} type - The type of the projection.
     * @param {Key | any} key - The key of the projection.
     * @param {Cancellation} [cancellation] - The cancellation token.
     * @returns {Promise<CurrentState<TProjection>>} A {@link Promise} that when resolved returns the current state of the projection.
     * @template TProjection The type of the projection.
     */
    abstract getState<TProjection>(type: Constructor<TProjection>, key: Key | any, cancellation?: Cancellation): Promise<CurrentState<TProjection>>;

    /**
     * Gets a projection state by key for a projection specified by projection identifier.
     * @param {Constructor<TProjection>} type - The type of the projection.
     * @param {Key | any} key - The key of the projection.
     * @param {ProjectionId | Guid | string} projection - The id of the projection.
     * @param {Cancellation} [cancellation] - The cancellation token.
     * @returns {Promise<CurrentState<TProjection>>} A {@link Promise} that when resolved returns the current state of the projection.
     * @template TProjection The type of the projection.
     */
    abstract getState<TProjection>(type: Constructor<TProjection>, key: Key | any, projection: ProjectionId | Guid | string, cancellation?: Cancellation): Promise<CurrentState<TProjection>>;

    /**
     * Gets a projection state by key for a projection specified by projection and scope identifier.
     * @param {Constructor<TProjection>} type - The type of the projection.
     * @param {Key | any} key - The key of the projection.
     * @param {ProjectionId | Guid | string} projection - The id of the projection.
     * @param {ScopeId | Guid | string} scope - The scope the projection in.
     * @param {Cancellation} [cancellation] - The cancellation token.
     * @returns {Promise<CurrentState<TProjection>>} A {@link Promise} that when resolved returns the current state of the projection.
     * @template TProjection The type of the projection.
     */
    abstract getState<TProjection>(type: Constructor<TProjection>, key: Key | any, projection: ProjectionId | Guid | string, scope: ScopeId | Guid | string, cancellation?: Cancellation): Promise<CurrentState<TProjection>>;

    /**
     * Gets a projection state by key for a projection specified by projection identifier.
     * @param {Key | any} key - The key of the projection.
     * @param {ProjectionId | Guid | string} projection - The id of the projection.
     * @param {Cancellation} [cancellation] - The cancellation token.
     * @returns {Promise<CurrentState<any>>} A {@link Promise} that when resolved returns the current state of the projection.
     */
    abstract getState(key: Key | any, projection: ProjectionId | Guid | string, cancellation?: Cancellation): Promise<CurrentState<any>>;

    /**
     * Gets a projection state by key for a projection specified by projection and scope identifier.
     * @param {Key | any} key - The key of the projection.
     * @param {ProjectionId | Guid | string} projection - The id of the projection.
     * @param {ScopeId | Guid | string} scpåe - The scope the projection in.
     * @param {Cancellation} [cancellation] - The cancellation token.
     * @returns {Promise<CurrentState<any>>} A {@link Promise} that when resolved returns the current state of the projection.
     */
    abstract getState(key: Key | any, projection: ProjectionId | Guid | string, scope: ScopeId | Guid | string, cancellation?: Cancellation): Promise<CurrentState<any>>;
}
