// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { Generation, GenerationLike } from '@dolittle/sdk.artifacts';
import { IClientBuildResults, IModelBuilder } from '@dolittle/sdk.common';

import { EventType } from '../EventType';
import { EventTypeAlias, EventTypeAliasLike } from '../EventTypeAlias';
import { eventType as eventTypeDecorator,  isDecoratedWithEventType, getDecoratedEventType } from '../eventTypeDecorator';
import { EventTypeId, EventTypeIdLike } from '../EventTypeId';
import { IEventTypesBuilder } from './IEventTypesBuilder';
import { EventTypeModelId } from '../EventTypeModelId';

/**
 * Represents an implementation of {@link IEventTypesBuilder}.
 */
export class EventTypesBuilder extends IEventTypesBuilder {
    /**
     * Initialises a new instance of the {@link EventTypesBuilder} class.
     * @param {IModelBuilder} _modelBuilder - For binding event types to identifiers.
     * @param {IClientBuildResults} _buildResults - For keeping track of build results.
     */
    constructor(
        private readonly _modelBuilder: IModelBuilder,
        private readonly _buildResults: IClientBuildResults
    ) {
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

        const identifier = new EventTypeModelId(eventType);
        this._modelBuilder.bindIdentifierToType(identifier, type);
        return this;
    }

    /** @inheritdoc */
    register<T = any>(type: Constructor<T>): IEventTypesBuilder {
        if (!isDecoratedWithEventType(type)) {
            this._buildResults.addFailure(`The event type class ${type.name} is not decorated as an event type`,`Add the @${eventTypeDecorator.name} decorator to the class`);
            return this;
        }

        const identifier = new EventTypeModelId(getDecoratedEventType(type));
        this._modelBuilder.bindIdentifierToType(identifier, type);
        return this;
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
