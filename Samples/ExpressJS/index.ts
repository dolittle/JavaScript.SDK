// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

// Sample code for the tutorial at https://dolittle.io/docs/tutorials/projections/

import createApplication, { static as serveStatic } from 'express';
import { json } from 'body-parser';
import { Logger } from 'winston';
import { dolittle, inject } from '@dolittle/sdk.extensions.express';
import { IProjectionOf } from '@dolittle/sdk.projections';

import { DishCounter } from './DishCounter';
import { DishPrepared } from './DishPrepared';

const application = createApplication();

application.use(dolittle());
application.use(json());

application.post('/prepare', (req, res, next) => {
    const { chef, dish } = req.body;
    req.dolittle.logger.info(`Received request to prepare dish ${dish} by chef ${chef}`);
    req.dolittle.eventStore
        .commit(new DishPrepared(dish, chef), 'Dolittle Tacos')
            .then(result => res.json(result))
            .catch(next);
});

application.get(
    '/counters',
    inject(IProjectionOf.for(DishCounter), 'Logger')(
        (req, res, next, dishCounter, logger: Logger) => {
            logger.info('Received request to get DishCounter projection');
            dishCounter.getAll()
                .then(result => res.json(result))
                .catch(next);
        }
    ));

application.use('/', serveStatic('public'));

const port = 8080;
application.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
