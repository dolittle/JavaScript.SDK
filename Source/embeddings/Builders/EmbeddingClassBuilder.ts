// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid, IEquatable } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { Generation } from '@dolittle/sdk.artifacts';
import { IClientBuildResults } from '@dolittle/sdk.common';
import { EventType, EventTypeId, EventTypeIdLike, EventTypeMap, IEventTypes } from '@dolittle/sdk.events';
import { DeleteReadModelInstance } from '@dolittle/sdk.projections';

import { EmbeddingDeleteCallback } from '../EmbeddingDeleteCallback';
import { EmbeddingProjectCallback } from '../EmbeddingProjectCallback';
import { EmbeddingUpdateCallback } from '../EmbeddingUpdateCallback';
import { Embedding } from '../Internal/Embedding';
import { IEmbedding } from '../Internal/IEmbedding';
import { EmbeddingDecoratedType } from './EmbeddingDecoratedType';
import { getOnDecoratedMethods } from './onDecorator';
import { OnDecoratedEmbeddingMethod } from './OnDecoratedEmbeddingMethod';
import { DeletionDecoratedMethod } from './DeletionDecoratedMethod';
import { UpdateDecoratedMethod } from './UpdateDecoratedMethod';
import { resolveDeletionToEvents as deleteDecorator, getDeletionDecoratedMethod } from './resolveDeletionToEventsDecorator';
import { resolveUpdateToEvents as updateDecorator, getUpdateDecoratedMethod } from './resolveUpdateToEventsDecorator';

/**
 * Represents a builder for building an embedding from a class.
 * @template T The embedding class type.
 */
export class EmbeddingClassBuilder<T> implements IEquatable{
    /**
     * Initializes a new instance of {@link  EmbeddingClassBuilder}.
     * @param {EmbeddingDecoratedType} type - The decorated embedding type of the class.
     */
    constructor(readonly type: EmbeddingDecoratedType) {
    }

    /** @inheritdoc */
    equals(other: any): boolean {
        if (this === other) return true;

        if (other instanceof EmbeddingClassBuilder) {
            return this.type === other.type;
        }

        return false;
    }

    /**
     * Builds the embedding.
     * @param {IEventTypes} eventTypes - For event types resolution.
     * @param {IClientBuildResults} results - For keeping track of build results.
     * @returns {IEmbedding | undefined} The built embedding if successful.
     */
    build(eventTypes: IEventTypes, results: IClientBuildResults): IEmbedding<any> | undefined {
        results.addInformation(`Building embedding ${this.type.embeddingId} from type ${this.type.type.name}`);

        const getUpdateMethod = getUpdateDecoratedMethod(this.type.type);
        if (getUpdateMethod === undefined) {
            results.addFailure(`The embedding class ${this.type.type.name} must have a method decorated with @${updateDecorator.name} decorator`);
            return;
        }
        const updateMethod = this.createUpdateMethod(getUpdateMethod);

        const getDeletionMethod = getDeletionDecoratedMethod(this.type.type);
        if (getDeletionMethod === undefined) {
            results.addFailure(`The embedding class ${this.type.type.name} must have a method decorated with @${deleteDecorator.name} decorator`);
            return;
        }
        const deleteMethod = this.createDeleteMethod(getDeletionMethod);

        const events = new EventTypeMap<EmbeddingProjectCallback<T>>();
        if (!this.tryAddAllOnMethods(events, this.type.type, eventTypes)) {
            results.addFailure(`Could not create embedding ${this.type.type.name} because it contains invalid on methods`);
            return;
        }

        return new Embedding<T>(this.type.embeddingId, this.type.type, events, updateMethod, deleteMethod);
    }

    private createUpdateMethod(method: UpdateDecoratedMethod): EmbeddingUpdateCallback<any> {
        return (receivedState, currentState, embeddingContext) => method.method.call(currentState, receivedState, embeddingContext);
    }

    private createDeleteMethod(method: DeletionDecoratedMethod): EmbeddingDeleteCallback {
        return (currentState, embeddingContext) => method.method.call(currentState, embeddingContext);
    }

    private tryAddAllOnMethods(events: EventTypeMap<EmbeddingProjectCallback<T>>, type: Constructor<any>, eventTypes: IEventTypes): boolean {
        let allMethodsValid = true;
        const methods = getOnDecoratedMethods(type);
        for (const method of methods) {
            const [hasEventType, eventType] = this.tryGetEventTypeFromMethod(method, eventTypes);

            if (!hasEventType) {
                allMethodsValid = false;
                continue;
            }

            const onMethod = this.createOnMethod(method);

            if (events.has(eventType!)) {
                allMethodsValid = false;
                continue;
            }
            events.set(eventType!, onMethod);
        }
        return allMethodsValid;
    }

    private tryGetEventTypeFromMethod(method: OnDecoratedEmbeddingMethod, eventTypes: IEventTypes): [boolean, EventType | undefined] {
        if (this.eventTypeIsId(method.eventTypeOrId)) {
            return [
                true,
                new EventType(
                    EventTypeId.from(method.eventTypeOrId),
                    method.generation ? Generation.from(method.generation) : Generation.first)
            ];
        } else if (!eventTypes.hasFor(method.eventTypeOrId)) {
            return [false, undefined];
        } else {
            return [true, eventTypes.getFor(method.eventTypeOrId)];
        }
    }

    private eventTypeIsId(eventTypeOrId: Constructor<any> | EventTypeIdLike): eventTypeOrId is EventTypeIdLike {
        return eventTypeOrId instanceof EventTypeId || eventTypeOrId instanceof Guid || typeof eventTypeOrId === 'string';
    }

    private createOnMethod(method: OnDecoratedEmbeddingMethod): EmbeddingProjectCallback<T> {
        return async (instance, event, embeddingProjectionContext) => {
            const result = await method.method.call(instance, event, embeddingProjectionContext);
            if (result instanceof DeleteReadModelInstance) {
                return result;
            }
            return instance;
        };
    }
}
