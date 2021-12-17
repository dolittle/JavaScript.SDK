// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { Generation, GenerationLike } from '@dolittle/sdk.artifacts';
import { IClientBuildResults, UniqueBindingBuilder } from '@dolittle/sdk.common';

import { EventType } from '../EventType';
import { EventTypeAlias, EventTypeAliasLike } from '../EventTypeAlias';
import { eventType as eventTypeDecorator,  isDecoratedWithEventType, getDecoratedEventType } from '../eventTypeDecorator';
import { EventTypeId, EventTypeIdLike } from '../EventTypeId';
import { EventTypes } from '../EventTypes';
import { IEventTypes } from '../IEventTypes';
import { IEventTypesBuilder } from './IEventTypesBuilder';

/**
 * Represents a builder for adding associations into {@link IEventTypes} instance.
 */
export class EventTypesBuilder extends IEventTypesBuilder {
    private readonly _bindings = new UniqueBindingBuilder<EventType, Constructor<any>>(
        (eventType, type, count) => `The event type ${eventType} was bound to ${type.name} ${count} times.`,
        (eventType, types) => `The event type ${eventType} was associated with multiple classes (${types.map(_ => _.name).join(', ')}). None of these will be registered.`,
        (type, eventTypes) => `The class ${type.name} was associated with multiple event types (${eventTypes.join(', ')}). None of these will be registered`,
    );

    /**
     * Initialises a new instance of the {@link EventTypesBuilder} class.
     * @param {IClientBuildResults} _buildResults - For keeping track of build results.
     */
    constructor(private readonly _buildResults: IClientBuildResults) {
        super();
    }

    /** @inheritdoc */
    associate<T = any>(type: Constructor<T>, eventType: EventType): IEventTypesBuilder;
    associate<T = any>(type: Constructor<T>, identifier: EventTypeIdLike, alias?: EventTypeAliasLike): IEventTypesBuilder;
    associate<T = any>(type: Constructor<T>, identifier: EventTypeIdLike, generation: GenerationLike, alias?: EventTypeAliasLike): IEventTypesBuilder;
    associate<T = any>(type: Constructor<T>, eventTypeOrIdentifier: EventType | EventTypeIdLike, maybeGenerationOrMaybeAlias?: GenerationLike | EventTypeAliasLike | undefined, maybeAlias?: EventTypeAliasLike): IEventTypesBuilder {
        const [generation, alias] = this.getGenerationAndAlias(maybeGenerationOrMaybeAlias, maybeAlias);
        const eventType = eventTypeOrIdentifier instanceof EventType
            ? eventTypeOrIdentifier
            : new EventType(EventTypeId.from(eventTypeOrIdentifier), generation, alias);

        this._bindings.add(eventType, type);
        return this;
    }

    /** @inheritdoc */
    register<T = any>(type: Constructor<T>): IEventTypesBuilder {
        if (!isDecoratedWithEventType(type)) {
            this._buildResults.addFailure(`The event type class ${type.name} is not decorated as an event type`,`Add the @${eventTypeDecorator.name} decorator to the class`);
            return this;
        }

        this._bindings.add(getDecoratedEventType(type), type);
        return this;
    }

    /**
     * Builds an {@link IEventTypes} from the associated and registered event types.
     * @returns {IEventTypes} The built event types.
     */
    build(): IEventTypes {
        const uniqueBindings = this._bindings.buildUnique(this._buildResults);
        const eventTypes = new EventTypes();
        for (const { identifier: eventType, value: type } of uniqueBindings) {
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
