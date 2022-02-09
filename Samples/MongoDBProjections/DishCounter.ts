// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { convertToMongoDB, copyProjectionToMongoDB, on, projection, MongoDBConversion, ProjectionContext } from '@dolittle/sdk.projections';

import { DishPrepared } from './DishPrepared';

@projection('98f9db66-b6ca-4e5f-9fc3-638626c9ecfa')
@copyProjectionToMongoDB()
export class DishCounter {

    name: string = 'Unknown';

    numberOfTimesPrepared: number = 0;

    @convertToMongoDB(MongoDBConversion.Date)
    lastPrepared: Date = new Date(0);

    @on(DishPrepared, _ => _.keyFromProperty('Dish'))
    on(event: DishPrepared, projectionContext: ProjectionContext) {
        this.name = event.Dish;
        this.numberOfTimesPrepared ++;
        this.lastPrepared = projectionContext.eventContext.occurred.toJSDate();
    }
}
