// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

// Sample code for the tutorial at https://dolittle.io/docs/tutorials/projections/

import createApplication, { static as serveStatic } from 'express';
import { json } from 'body-parser';
import { dolittle } from '@dolittle/sdk.extensions.express';

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

application.get('/counters', (req, res, next) => {
    req.dolittle.logger.info('Received request for DishCounter');
    req.dolittle.projections
        .getAll(DishCounter)
            .then(result => Array.from(result.values()))
            .then(results => results.map(({ key, state }) => ({ dish: key.value, ...state })))
            .then(result => res.json(result))
            .catch(next);
});

application.use('/', serveStatic('public'));

const port = 8080;
application.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
