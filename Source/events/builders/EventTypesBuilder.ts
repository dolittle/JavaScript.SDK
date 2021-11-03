// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';
import { Generation, GenerationLike } from '@dolittle/sdk.artifacts';
import { EventType, EventTypeAlias, EventTypeAliasLike, EventTypeId, EventTypeIdLike, EventTypesFromDecorators, IEventTypes } from '../index';

export type EventTypesBuilderCallback = (builder: EventTypesBuilder) => void;

/**
 * Represents a builder for adding associations into {@link IEventTypes} instance.
 */
export class EventTypesBuilder {
    private _associations: [Constructor<any>, EventType][] = [];

    /**
     * Associate a type with an unique event type identifier and optional generation.
     * @param {Constructor} type Type to associate.
     * @param {EventType} eventType EventType to associate with.
     */
    associate<T = any>(type: Constructor<T>, eventType: EventType): EventTypesBuilder;
    /**
     * Associate a type with an unique event type identifier and optional generation.
     * @param {Constructor} type Type to associate.
     * @param {EventTypeId | Guid | string} identifier Identifier to associate with.
     */
    associate<T = any>(type: Constructor<T>, identifier: EventTypeIdLike, alias?: EventTypeAliasLike): EventTypesBuilder;
    /**
     * Associate a type with an unique event type identifier and optional generation.
     * @param {Constructor} type Type to associate.
     * @param {EventTypeId | Guid | string} identifier Identifier to associate with.
     * @param {Generation | number} generation The generation to associate with.
     */
    associate<T = any>(type: Constructor<T>, identifier: EventTypeIdLike, generation: GenerationLike, alias?: EventTypeAliasLike): EventTypesBuilder;
    associate<T = any>(type: Constructor<T>, eventTypeOrIdentifier: EventType | EventTypeIdLike, maybeGenerationOrMaybeAlias?: GenerationLike | EventTypeAliasLike | undefined, maybeAlias?: EventTypeAliasLike): EventTypesBuilder {
        const [generation, alias] = this.getGenerationAndAlias(maybeGenerationOrMaybeAlias, maybeAlias);
        const eventType = eventTypeOrIdentifier instanceof EventType ?
                            eventTypeOrIdentifier
                            : new EventType(
                                EventTypeId.from(eventTypeOrIdentifier),
                                generation,
                                alias);
        this._associations.push([type, eventType]);
        return this;
    }

    /**
     * Register the type as an {@link EventType}.
     * @param type The type to register as an {@link EventType}
     */
    register<T = any>(type: Constructor<T>): EventTypesBuilder {
        this.associate(type, EventTypesFromDecorators.eventTypes.getFor(type));
        return this;
    }

    /**
     * Build an artifacts instance.
     * @returns {IArtifacts} Artifacts to work with.
     */
    addAssociationsInto(eventTypes: IEventTypes): void {
        for (const [type, eventType] of this._associations) {
            eventTypes.associate(type, eventType);
        }
    }

    private getGenerationAndAlias(maybeGenerationOrMaybeAlias: GenerationLike | EventTypeAliasLike | undefined, maybeAlias: EventTypeAliasLike | undefined): [Generation, EventTypeAlias | undefined] {
        let generation: Generation | undefined;
        let alias: EventTypeAlias | undefined;
        if (maybeAlias !== undefined) {
            alias = EventTypeAlias.from(maybeAlias);
        }
        if (maybeGenerationOrMaybeAlias !== undefined) {
            if (maybeGenerationOrMaybeAlias instanceof Generation || typeof maybeGenerationOrMaybeAlias === 'number') {
                generation = Generation.from(maybeGenerationOrMaybeAlias);
            } else if (maybeGenerationOrMaybeAlias instanceof EventTypeAlias || typeof maybeGenerationOrMaybeAlias === 'string') {
                alias = EventTypeAlias.from(maybeGenerationOrMaybeAlias);
            }
        }
        return [generation ?? Generation.first, alias];
    }

}
