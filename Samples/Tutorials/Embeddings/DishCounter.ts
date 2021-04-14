// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// Sample code for the tutorial at https://dolittle.io/tutorials/projections/typescript/

import { EmbeddingContext, embedding, compare } from '@dolittle/sdk.embeddings';
import { ProjectionContext, on } from '@dolittle/sdk.projections';
import { DishPrepared } from './DishPrepared';

@embedding('98f9db66-b6ca-4e5f-9fc3-638626c9ecfa')
export class DishCounter {
    numberOfTimesPrepared: number = 0;

    @compare()
    compare(receivedState, embeddingContext: EmbeddingContext) {
        if (receivedState.numberOfTimesPrepared > this.numberOfTimesPrepared) {
            return new DishPrepared(embeddingContext.key, 'default chef');
        }
    }

    @on(DishPrepared, _ => _.keyFromProperty('Dish'))
    on(event: DishPrepared, projectionContext: ProjectionContext) {
        this.numberOfTimesPrepared ++;
    }
}
