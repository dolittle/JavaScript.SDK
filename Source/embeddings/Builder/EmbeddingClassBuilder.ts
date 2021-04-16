// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EmbeddingsClient } from '@dolittle/runtime.contracts/Embeddings/Embeddings_grpc_pb';
import { IContainer } from '@dolittle/sdk.common';
import { EventTypeMap, IEventTypes } from '@dolittle/sdk.events';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { KeySelector, ProjectionCallback } from '@dolittle/sdk.projections';
import { OnDecoratorResolver } from '@dolittle/sdk.projections/Builder';
import { Cancellation } from '@dolittle/sdk.resilience';
import { Constructor } from '@dolittle/types';
import { Logger } from 'winston';

import { EmbeddingProcessor } from '../Internal';
import {
    Embedding,
    EmbeddingCompareCallback,
    EmbeddingDeleteCallback,
    IEmbeddings
    } from '..';

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

        const events = new EventTypeMap<[ProjectionCallback<T>, KeySelector]>();
        if (!this.tryAddAllOnMethods(events, this._embeddingType, eventTypes)) {
            logger.warn(`Could not create embedding ${this._embeddingType.name} because it contains invalid on methods`);
            return;
        }
        const embedding = new Embedding<T>(decoratedType.embeddingId, decoratedType.type, events, compareMethod, deleteMethod);
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
            const result = method.method.call(currentState, receivedState, embeddingContext);
            return result;
        };
    }

    private createDeleteMethod(method: DeleteDecoratedMethod): EmbeddingDeleteCallback {
        return (currentState, embeddingContext) => {
            const result = method.method.call(currentState, embeddingContext);
            return result;
        };
    }
}
