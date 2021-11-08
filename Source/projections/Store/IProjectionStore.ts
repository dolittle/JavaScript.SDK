// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { ScopeId } from '@dolittle/sdk.events';
import { Cancellation } from '@dolittle/sdk.resilience';
import { Constructor } from '@dolittle/types';
import { Key, ProjectionId } from '..';
import { CurrentState } from './CurrentState';


/**
 * Defines the API surface for getting projections.
 */
export abstract class IProjectionStore {
    /**
     * Gets a projection state by key for a projection associated with a type.
     * @template TProjection
     * @param {Constructor<T>} type The type of the projection.
     * @param {Key | any} key The key of the projection.
     * @param {Cancellation} [cancellation] The cancellation token.
     * @returns {Promise<CurrentState<TProjection>>}
     */
    abstract get<TProjection>(type: Constructor<TProjection>, key: Key | any, cancellation?: Cancellation): Promise<CurrentState<TProjection>>;

    /**
     * Gets a projection state by key for a projection specified by projection identifier.
     * @template TProjection
     * @param {Constructor<T>} type The type of the projection.
     * @param {Key | any} key The key of the projection.
     * @param {ProjectionId | Guid | string} projection The id of the projection.
     * @param {Cancellation} [cancellation] The cancellation token.
     * @returns {Promise<CurrentState<TProjection>>}
     */
    abstract get<TProjection>(type: Constructor<TProjection>, key: Key | any, projection: ProjectionId | Guid | string, cancellation?: Cancellation): Promise<CurrentState<TProjection>>;

    /**
     * Gets a projection state by key for a projection specified by projection and scope identifier.
     * @template TProjection
     * @param {Constructor<T>} type The type of the projection.
     * @param {Key | any} key The key of the projection.
     * @param {ProjectionId | Guid | string} projection The id of the projection.
     * @param {ScopeId | Guid | string} scope The scope the projection in.
     * @param {Cancellation} [cancellation] The cancellation token.
     * @returns {Promise<CurrentState<TProjection>>}
     */
    abstract get<TProjection>(type: Constructor<TProjection>, key: Key | any, projection: ProjectionId | Guid | string, scope: ScopeId | Guid | string, cancellation?: Cancellation): Promise<CurrentState<TProjection>>;

    /**
     * Gets a projection state by key for a projection specified by projection identifier.
     * @param {Key | any} key The key of the projection.
     * @param {ProjectionId | Guid | string} projection The id of the projection.
     * @param {Cancellation} [cancellation] The cancellation token.
     * @returns {Promise<CurrentState<any>>}
     */
    abstract get(key: Key | any, projection: ProjectionId | Guid | string, cancellation?: Cancellation): Promise<CurrentState<any>>;

    /**
     * Gets a projection state by key for a projection specified by projection and scope identifier.
     * @param {Key | any} key The key of the projection.
     * @param {ProjectionId | Guid | string} projection The id of the projection.
     * @param {ScopeId | Guid | string} scpåe The scope the projection in.
     * @param {Cancellation} [cancellation] The cancellation token.
     * @returns {Promise<CurrentState<any>>}
     */
    abstract get(key: Key | any, projection: ProjectionId | Guid | string, scope: ScopeId | Guid | string, cancellation?: Cancellation): Promise<CurrentState<any>>;

    /**
     * Gets all projection states for a projection associated with a type.
     * @template T
     * @param {Constructor<T>} type The type of the projection.
     * @param {Cancellation} [cancellation] The cancellation token.
     * @returns {Promise<CurrentState<TPRojection>>}
     */
    abstract getAll<TProjection>(type: Constructor<TProjection>, cancellation?: Cancellation): Promise<Map<Key, CurrentState<TProjection>>>;

    /**
     * Gets all projection states for a projection specified by projection identifier.
     * @template TProjection
     * @param {Constructor<T>} type The type of the projection.
     * @param {ProjectionId | Guid | string} projection The id of the projection.
     * @param {Cancellation} [cancellation] The cancellation token.
     * @returns {Promise<CurrentState<TPRojection>>}
     */
    abstract getAll<TProjection>(type: Constructor<TProjection>, projection: ProjectionId | Guid | string, cancellation?: Cancellation): Promise<Map<Key, CurrentState<TProjection>>>;

    /**
     * Gets all projection states for a projection specified by projection and scope identifier.
     * @template TProjection
     * @param {Constructor<T>} type The type of the projection.
     * @param {ProjectionId | Guid | string} projection The id of the projection.
     * @param {ScopeId | Guid | string} scope The scope the projection in.
     * @param {Cancellation} [cancellation] The cancellation token.
     * @returns {Promise<Map<Key, CurrentState<TProjection>>}
     */
    abstract getAll<TProjection>(type: Constructor<TProjection>, projection: ProjectionId | Guid | string, scope: ScopeId | Guid | string, cancellation?: Cancellation): Promise<Map<Key, CurrentState<TProjection>>>;

    /**
     * Gets all projection states for a projection specified by projection identifier.
     * @param {ProjectionId | Guid | string} projection The id of the projection.
     * @param {Cancellation} [cancellation] The cancellation token.
     * @returns {Promise<Map<Key, CurrentState<any>>}
     */
    abstract getAll(projection: ProjectionId | Guid | string, cancellation?: Cancellation): Promise<Map<Key,CurrentState<any>>>;

    /**
     * Gets all projection states for a projection specified by projection and scope identifier.
     * @param {ProjectionId | Guid | string} projection The id of the projection.
     * @param {ScopeId | Guid | string} scope The scope the projection in.
     * @param {Cancellation} [cancellation] The cancellation token.
     * @returns {Promise<Map<Key, CurrentState<any>>}
     */
    abstract getAll(projection: ProjectionId | Guid | string, scope: ScopeId | Guid | string, cancellation?: Cancellation): Promise<Map<Key, CurrentState<any>>>;
}
