// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// Sample code for the tutorial at https://dolittle.io/tutorials/projections/typescript/

import { compare, deleteMethod, embedding, EmbeddingContext, EmbeddingProjectContext, on } from '@dolittle/sdk.embeddings';
import { ProjectionResult } from '@dolittle/sdk.projections';
import { DishPrepared } from './DishPrepared';
import { DishRemoved } from './DishRemoved';

@embedding('98f9db66-b6ca-4e5f-9fc3-638626c9ecfa')
export class DishCounter {
    numberOfTimesPrepared: number = 0;

    @compare()
    compare(receivedState: DishCounter, embeddingContext: EmbeddingContext) {
        if (receivedState.numberOfTimesPrepared > this.numberOfTimesPrepared) {
            return new DishPrepared(embeddingContext.key.value, embeddingContext.key.value);
        }
    }

    @deleteMethod()
    remove(embeddingContext: EmbeddingContext) {
        return new DishRemoved(embeddingContext.key.value);
    }

    @on(DishPrepared, _ => _.keyFromProperty('Dish'))
    onDishPrepared(event: DishPrepared, context: EmbeddingProjectContext) {
        this.numberOfTimesPrepared ++;
    }

    @on(DishRemoved, _ => _.keyFromProperty('Dish'))
    onDishRemoved(event: DishRemoved, context: EmbeddingProjectContext) {
        return ProjectionResult.delete;
    }
}
