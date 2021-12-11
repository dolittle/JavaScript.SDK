// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { Generation, GenerationLike } from '@dolittle/sdk.artifacts';

import { EventType } from '../EventType';
import { EventTypeAlias, EventTypeAliasLike } from '../EventTypeAlias';
import { EventTypeId, EventTypeIdLike } from '../EventTypeId';
import { EventTypes } from '../EventTypes';
import { EventTypesFromDecorators } from '../EventTypesFromDecorators';
import { IEventTypes } from '../IEventTypes';
import { IEventTypesBuilder } from './IEventTypesBuilder';

/**
 * Represents a builder for adding associations into {@link IEventTypes} instance.
 */
export class EventTypesBuilder extends IEventTypesBuilder {
    private _associations: [Constructor<any>, EventType][] = [];

    /** @inheritdoc */
    associate<T = any>(type: Constructor<T>, eventType: EventType): IEventTypesBuilder;
    associate<T = any>(type: Constructor<T>, identifier: EventTypeIdLike, alias?: EventTypeAliasLike): IEventTypesBuilder;
    associate<T = any>(type: Constructor<T>, identifier: EventTypeIdLike, generation: GenerationLike, alias?: EventTypeAliasLike): IEventTypesBuilder;
    associate<T = any>(type: Constructor<T>, eventTypeOrIdentifier: EventType | EventTypeIdLike, maybeGenerationOrMaybeAlias?: GenerationLike | EventTypeAliasLike | undefined, maybeAlias?: EventTypeAliasLike): IEventTypesBuilder {
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

    /** @inheritdoc */
    register<T = any>(type: Constructor<T>): IEventTypesBuilder {
        this.associate(type, EventTypesFromDecorators.eventTypes.getFor(type));
        return this;
    }

    /**
     * Builds an {@link IEventTypes} from the associated and registered event types.
     * @returns {IEventTypes} The built event types.
     */
    build(): IEventTypes {
        const eventTypes = new EventTypes();
        for (const [type, eventType] of this._associations) {
            eventTypes.associate(type, eventType);
        }
        return eventTypes;
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
