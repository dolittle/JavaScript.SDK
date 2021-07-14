// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// Sample code for the tutorial at https://dolittle.io/tutorials/projections/typescript/

import { compare, remove, embedding, EmbeddingContext, EmbeddingProjectContext, on } from '@dolittle/sdk.embeddings';
import { ProjectionResult } from '@dolittle/sdk.projections';
import { DishPrepared } from './DishPrepared';
import { DishRemoved } from './DishRemoved';

@embedding('98f9db66-b6ca-4e5f-9fc3-638626c9ecfa')
export class DishCounter {
    dish: string = '';
    numberOfTimesPrepared: number = 0;

    @compare()
    compare(receivedState: DishCounter, embeddingContext: EmbeddingContext) {
        console.log(`Call to compare DishCounter. Received state:`);
        console.log(receivedState);
        console.log(`Current state:`);
        console.log(this);
        if (receivedState.numberOfTimesPrepared > this.numberOfTimesPrepared) {
            console.log(`State out of sync: A dish needs to be prepared!`);
            return new DishPrepared(receivedState.dish);
        }
    }

    @resolveDeletionToEvents()
    remove(embeddingContext: EmbeddingContext) {
        console.log('Call to delete DishCounter');
        return new DishRemoved(this.dish);
    }

    @on(DishPrepared)
    onDishPrepared(event: DishPrepared, context: EmbeddingProjectContext) {
        console.log(`Handling DishPrepared`);
        if (!this.dish) {
            this.dish = event.Dish;
        }

        this.numberOfTimesPrepared++;
    }

    @on(DishRemoved)
    onDishRemoved(event: DishRemoved, context: EmbeddingProjectContext) {
        console.log(`Handling DishRemoved`);
        return ProjectionResult.delete;
    }
}
