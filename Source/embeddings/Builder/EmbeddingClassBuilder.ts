// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { EmbeddingsClient } from '@dolittle/runtime.contracts/Embeddings/Embeddings_grpc_pb';
import { IContainer } from '@dolittle/sdk.common';
import { EventType, EventTypeId, EventTypeIdLike, EventTypeMap, IEventTypes } from '@dolittle/sdk.events';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { DeleteReadModelInstance } from '@dolittle/sdk.projections';
import { Cancellation } from '@dolittle/sdk.resilience';
import { Constructor } from '@dolittle/types';
import { Logger } from 'winston';
import {
    EmbeddingUpdateCallback,
    EmbeddingDeleteCallback,
    EmbeddingProjectCallback,
    OnDecoratedEmbeddingMethods
} from '..';
import { Embedding, EmbeddingProcessor, IEmbeddings } from '../Internal';
import { CannotRegisterEmbeddingThatIsNotAClass } from './CannotRegisterEmbeddingThatIsNotAClass';
import { UpdateDecoratedMethod } from './UpdateDecoratedMethod';
import { UpdateDecoratedMethods } from './UpdateDecoratedMethods';
import { resolveUpdateToEvents as updateDecorator } from './updateDecorator';
import { EmbeddingDecoratedTypes } from './EmbeddingDecoratedTypes';
import { embedding as embeddingDecorator } from './embeddingDecorator';
import { ICanBuildAndRegisterAnEmbedding } from './ICanBuildAndRegisterAnEmbedding';
import { OnDecoratedEmbeddingMethod } from './OnDecoratedEmbeddingMethod';
import { DeletionDecoratedMethod } from './DeletionDecoratedMethod';
import { DeletionDecoratedMethods } from './DeletionDecoratedMethods';
import { resolveDeletionToEvents as deleteDecorator } from './deleteDecorator';
import { Generation } from '@dolittle/sdk.artifacts';


/*
 * Represents a builder for building an embedding class.
 */
export class EmbeddingClassBuilder<T> implements ICanBuildAndRegisterAnEmbedding {
    private readonly _embeddingType: Constructor<T>;

    /**
     * Initializes a new instance of {@link  EmbeddingClassBuilder<T>}
     * @param {Constructor<T> | T} typeOrInstance The embedding type or instance
     */
    constructor(typeOrInstance: Constructor<T> | T) {
        if (typeOrInstance instanceof Function) {
            this._embeddingType = typeOrInstance;
        } else {
            this._embeddingType = Object.getPrototypeOf(typeOrInstance).constructor;
            if (this._embeddingType === undefined) {
                throw new CannotRegisterEmbeddingThatIsNotAClass(typeOrInstance);
            }
        }
    }

    /** @inheritdoc */
    buildAndRegister(
        client: EmbeddingsClient,
        embeddings: IEmbeddings,
        container: IContainer,
        executionContext: ExecutionContext,
        eventTypes: IEventTypes,
        logger: Logger,
        cancellation: Cancellation): void {
        logger.debug(`Building embedding of type ${this._embeddingType.name}`);
        const decoratedType = EmbeddingDecoratedTypes.types.find(_ => _.type === this._embeddingType);
        if (decoratedType === undefined) {
            logger.warn(`The embedding class ${this._embeddingType.name} must be decorated with an @${embeddingDecorator.name} decorator`);
            return;
        }
        logger.debug(`Building embedding ${decoratedType.embeddingId} from type ${this._embeddingType.name}`);

        const getUpdateMethod = UpdateDecoratedMethods.methodPerEmbedding.get(this._embeddingType);
        if (getUpdateMethod === undefined) {
            logger.warn(`The embedding class ${this._embeddingType.name} must have a method decorated with @${updateDecorator.name} decorator`);
            return;
        }
        const updateMethod = this.createUpdateMethod(getUpdateMethod);

        const getDeletionMethod = DeletionDecoratedMethods.methodPerEmbedding.get(this._embeddingType);
        if (getDeletionMethod === undefined) {
            logger.warn(`The embedding class ${this._embeddingType.name} must have a method decorated with @${deleteDecorator.name} decorator`);
            return;
        }
        const deleteMethod = this.createDeleteMethod(getDeletionMethod);

        const events = new EventTypeMap<EmbeddingProjectCallback<T>>();
        if (!this.tryAddAllOnMethods(events, this._embeddingType, eventTypes)) {
            logger.warn(`Could not create embedding ${this._embeddingType.name} because it contains invalid on methods`);
            return;
        }

        const embedding = new Embedding<T>(
            decoratedType.embeddingId,
            decoratedType.type,
            events,
            updateMethod,
            deleteMethod);

        embeddings.register<T>(
            new EmbeddingProcessor<T>(
                embedding,
                client,
                executionContext,
                eventTypes,
                logger
            ), cancellation);
    }


    private createUpdateMethod(method: UpdateDecoratedMethod): EmbeddingUpdateCallback<any> {
        return (receivedState, currentState, embeddingContext) => method.method.call(currentState, receivedState, embeddingContext);
    }

    private createDeleteMethod(method: DeletionDecoratedMethod): EmbeddingDeleteCallback {
        return (currentState, embeddingContext) => method.method.call(currentState, embeddingContext);
    }

    private tryAddAllOnMethods(events: EventTypeMap<EmbeddingProjectCallback<T>>, type: Constructor<any>, eventTypes: IEventTypes): boolean {
        let allMethodsValid = true;
        const methods = OnDecoratedEmbeddingMethods.methodsPerEmbedding.get(type);
        if (methods === undefined) {
            allMethodsValid = false;
            return allMethodsValid;
        }

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

    private eventTypeIsId(eventTypeOrId: Constructor<any> | EventTypeIdLike): eventTypeOrId is EventTypeId | Guid | string {
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
