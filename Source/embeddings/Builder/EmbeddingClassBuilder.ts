// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { EventType, EventTypeId, EventTypeMap, Generation, IEventTypes } from '@dolittle/sdk.events';
import { Cancellation } from '@dolittle/sdk.resilience';
import { Guid } from '@dolittle/rudiments';
import { IContainer } from '@dolittle/sdk.common';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { Constructor } from '@dolittle/types';
import { on as onDecorator, OnDecoratedMethod, OnDecoratedMethods, ProjectionCallback, DeleteReadModelInstance, KeySelector } from '@dolittle/sdk.projections';

import { EmbeddingsClient } from '@dolittle/runtime.contracts/Events.Processing/Embeddings_grpc_pb';

import { IEmbeddings, Embedding, EmbeddingCompareCallback } from '..';
import { EmbeddingProcessor } from '../Internal';

import { CannotRegisterEmbeddingThatIsNotAClass } from './CannotRegisterEmbeddingThatIsNotAClass';
import { ICanBuildAndRegisterAnEmbedding } from './ICanBuildAndRegisterAnEmbedding';
import { compare as compareDecorator } from './compareDecorator';
import { embedding as embeddingDecorator } from './embeddingDecorator';
import { EmbeddingDecoratedTypes } from './EmbeddingDecoratedTypes';
import { CompareDecoratedMethods } from './CompareDecoratedMethods';
import { CompareDecoratedMethod } from './CompareDecoratedMethod';
import { OnDecoratorResolver } from '@dolittle/sdk.projections/Builder';

export class EmbeddingClassBuilder<T> extends OnDecoratorResolver implements ICanBuildAndRegisterAnEmbedding {
    private readonly _embeddingType: Constructor<T>;

    constructor(typeOrInstance: Constructor<T> | T) {
        super();
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
        const getCompareMethod = CompareDecoratedMethods.methodPerEmbedding.get(this._embeddingType);
        if (getCompareMethod === undefined) {
            logger.warn(`The embedding class ${this._embeddingType.name} must have a method decorated with @${compareDecorator.name} decorator`);
            return;
        }
        const compareMethod = this.createCompareMethod(getCompareMethod);


        logger.debug(`Building embedding ${decoratedType.embeddingId} from type ${this._embeddingType.name}`);

        const methods = OnDecoratedMethods.methodsPerProjection.get(this._embeddingType);
        if (methods === undefined) {
            logger.warn(`There are no on methods specified in embedding ${this._embeddingType.name}. An embedding must to be decorated with @${onDecorator.name}`);
            return;
        }
        const events = new EventTypeMap<[ProjectionCallback<T>, KeySelector]>();
        if (!this.tryAddAllOnMethods(events, this._embeddingType, eventTypes)) {
            logger.warn(`Could not create embedding ${this._embeddingType.name} because it contains invalid on methods`);
            return;
        }
        const embedding = new Embedding<T>(decoratedType.embeddingId, decoratedType.type, events, compareMethod);
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
        return (receivedState, currentState, embeddingContext) => {
            const result = method.method.call(receivedState, currentState, embeddingContext);
            return result;
        }
    }
}
