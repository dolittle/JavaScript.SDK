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
    dish: string = '';

    @compare()
    compare(receivedState: DishCounter, embeddingContext: EmbeddingContext) {
        console.log(`Comparing embedding. Received state:`);
        console.log(receivedState);
        console.log(`Current state:`);
        console.log(this);
        console.log(`Context:`);
        // console.log(embeddingContext);
        if (receivedState.numberOfTimesPrepared > this.numberOfTimesPrepared) {
            console.log(`A dish needs to be prepared!`);
            return new DishPrepared(receivedState.dish);
        }
    }

    @deleteMethod()
    remove(embeddingContext: EmbeddingContext) {
        console.log('A dish deens to be removed!');
        return new DishRemoved(this.dish);
    }

    @on(DishPrepared)
    onDishPrepared(event: DishPrepared, context: EmbeddingProjectContext) {
        console.log(`Handling DishPrepared: ${JSON.stringify(event)}`);
        // console.log(context);
        if (!this.dish) {
            this.dish = event.Dish;//petridish
        }

        this.numberOfTimesPrepared++;
    }

    @on(DishRemoved)
    onDishRemoved(event: DishRemoved, context: EmbeddingProjectContext) {
        console.log(`Handling DishRemoved`);
        // console.log(`Embedding context: ${context}`);
        return ProjectionResult.delete;
    }
}
