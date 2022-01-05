// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';
import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

/**
 * Defines the system for working with identifiers.
 * @template TId The type of the identifer.
 */
export abstract class IIdentifiers<TId extends ConceptAs<Guid, string>> {

    /**
     * Gets all identifers.
     * @returns {TId[]} All identifiers associated with a type.
     */
    abstract getAll(): TId[];

    /**
     * Check if there is a type associated with an identifier.
     * @param {TId} input - Identifier.
     * @returns {boolean} True if there is, false if not.
     */
    abstract hasTypeFor(input: TId): boolean;

    /**
     * Get type for a given identifier.
     * @param {TId} input - Identifier.
     * @returns {Constructor<any>} Type for identifier.
     */
    abstract getTypeFor(input: TId): Constructor<any>;

    /**
     * Check if there is an identifier associated with a given type.
     * @param {Constructor<any>} type - Type to check for.
     * @returns {boolean} True if there is, false if not.
     */
    abstract hasFor(type: Constructor<any>): boolean;

    /**
     * Get the identifier associated with a given type.
     * @param {Constructor<any>} type - Type to get for.
     * @returns {TId} The identifier associated.
     */
    abstract getFor(type: Constructor<any>): TId;

    /**
     * Resolves an identifer from optional input or the given object.
     * @param {any} object - Object to resolve for.
     * @param {TId | Guid | string} [input] - Optional input as representations of an identifier.
     * @returns {TId} Resolved identifier.
     */
    abstract resolveFrom(object: any, input?: TId | Guid | string): TId;

    /**
     * Associate a type with an identifier.
     * @param {Constructor<any>} type - Type to associate.
     * @param {TId} identifier - Identifier to associate with.
     */
    abstract associate(type: Constructor<any>, identifier: TId): void;
}
