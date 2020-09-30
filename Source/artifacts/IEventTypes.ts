// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';
import { EventType } from './EventType';
import { EventTypeId } from './EventTypeId';

/**
 * Defines the system for working with {@link EventType}
 */
export interface IEventTypes {

    /**
     * Check if there is a type associated with an artifact.
     * @param {EventType} input Artifact.
     * @returns {boolean} true if there is, false if not.
     */
    hasTypeFor(input: EventType): boolean;

    /**
     * Get type for a given artifact.
     * @param {EventType} input Artifact.
     * @returns type for artifact.
     */
    getTypeFor(input: EventType): Constructor<any>;

    /**
     * Check if there is an {Artifact} definition for a given type.
     * @param {Function} type Type to check for.
     * @returns true if there is, false if not.
     */
    hasFor(type: Constructor<any>): boolean;

    /**
     * Get {Artifact} definition for a given type.
     * @param {Function} type Type to get for.
     * @returns {EventType} The artifact associated.
     */
    getFor(type: Constructor<any>): EventType;

    /**
     * Resolves an artifact from optional input or the given object.
     * @param object Object to resolve for.
     * @param [input] Optional input as an artifact or representations of artifacts as identifier.
     * @returns {EventType | EventTypeId | Guid | string} resolved artifacts.
     * @throws {UnableToResolveArtifact} If not able to resolve artifact.
     */
    resolveFrom(object: any, input?: EventType | EventTypeId | Guid | string): EventType | Guid | string;

    /**
     * Associate a type with a unique artifact identifier and optional generation.
     * @param {Constructor<any>} type Type to associate.
     * @param {EventType} artifact Artifact to associate with.
     */
    associate(type: Constructor<any>, artifact: EventType): void;
}
