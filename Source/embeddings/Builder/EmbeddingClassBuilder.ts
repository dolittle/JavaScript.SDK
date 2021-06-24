// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { EmbeddingsClient } from '@dolittle/runtime.contracts/Embeddings/Embeddings_grpc_pb';
import { IContainer } from '@dolittle/sdk.common';
import { EventType, EventTypeId, EventTypeMap, Generation, IEventTypes } from '@dolittle/sdk.events';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { DeleteReadModelInstance, KeySelector } from '@dolittle/sdk.projections';
import { Cancellation } from '@dolittle/sdk.resilience';
import { Constructor } from '@dolittle/types';
import { Logger } from 'winston';
import {
    EmbeddingCompareCallback,
    EmbeddingDeleteCallback,
    EmbeddingProjectCallback,
    OnDecoratedEmbeddingMethods
} from '..';
import { Embedding, EmbeddingProcessor, IEmbeddings } from '../Internal';
import { CannotRegisterEmbeddingThatIsNotAClass } from './CannotRegisterEmbeddingThatIsNotAClass';
import { CompareDecoratedMethod } from './CompareDecoratedMethod';
import { CompareDecoratedMethods } from './CompareDecoratedMethods';
import { compare as compareDecorator } from './compareDecorator';
import { DeleteDecoratedMethod } from './DeleteDecoratedMethod';
import { DeleteDecoratedMethods } from './DeleteDecoratedMethods';
import { deleteMethod as deleteDecorator } from './deleteDecorator';
import { EmbeddingDecoratedTypes } from './EmbeddingDecoratedTypes';
import { embedding as embeddingDecorator } from './embeddingDecorator';
import { ICanBuildAndRegisterAnEmbedding } from './ICanBuildAndRegisterAnEmbedding';
import { OnDecoratedEmbeddingMethod } from './OnDecoratedEmbeddingMethod';


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

        const getCompareMethod = CompareDecoratedMethods.methodPerEmbedding.get(this._embeddingType);
        if (getCompareMethod === undefined) {
            logger.warn(`The embedding class ${this._embeddingType.name} must have a method decorated with @${compareDecorator.name} decorator`);
            return;
        }
        const compareMethod = this.createCompareMethod(getCompareMethod);

        const getDeleteMethod = DeleteDecoratedMethods.methodPerEmbedding.get(this._embeddingType);
        if (getDeleteMethod === undefined) {
            logger.warn(`The embedding class ${this._embeddingType.name} must have a method decorated with @${deleteDecorator.name} decorator`);
            return;
        }
        const deleteMethod = this.createDeleteMethod(getDeleteMethod);

        const events = new EventTypeMap<EmbeddingProjectCallback<T>>();
        if (!this.tryAddAllOnMethods(events, this._embeddingType, eventTypes)) {
            logger.warn(`Could not create embedding ${this._embeddingType.name} because it contains invalid on methods`);
            return;
        }
        const embedding = new Embedding<T>(
            decoratedType.embeddingId,
            decoratedType.type,
            events,
            compareMethod,
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


    private createCompareMethod(method: CompareDecoratedMethod): EmbeddingCompareCallback<any> {
        return (receivedState, currentState, embeddingContext) => method.method.call(currentState, receivedState, embeddingContext);
    }

    private createDeleteMethod(method: DeleteDecoratedMethod): EmbeddingDeleteCallback {
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

    private eventTypeIsId(eventTypeOrId: Constructor<any> | EventTypeId | Guid | string): eventTypeOrId is EventTypeId | Guid | string {
        return eventTypeOrId instanceof EventTypeId || eventTypeOrId instanceof Guid || typeof eventTypeOrId === 'string';
    }

    private createOnMethod(method: OnDecoratedEmbeddingMethod): EmbeddingProjectCallback<T> {
        return (instance, event, embeddingProjectionContext) => {
            const result = method.method.call(instance, event, embeddingProjectionContext);
            if (result instanceof DeleteReadModelInstance) {
                return result;
            }
            return instance;
        };
    }
}
