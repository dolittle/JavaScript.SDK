// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// Sample code for the tutorial at https://dolittle.io/tutorials/projections/typescript/

import { ProjectionContext, projection, on } from '@dolittle/sdk.projections';
import { DishPrepared } from './DishPrepared';

@projection('98f9db66-b6ca-4e5f-9fc3-638626c9ecfa')
export class DishCounter {
    numberOfTimesPrepared: number = 0;

    @on(DishPrepared, _ => _.keyFromProperty('Dish'))
    on(event: DishPrepared, projectionContext: ProjectionContext) {
        this.numberOfTimesPrepared ++;
    }
}
