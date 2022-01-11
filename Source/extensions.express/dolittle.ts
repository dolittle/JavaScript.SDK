// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { RequestHandler } from 'express';
import { setTimeout } from 'timers';

import { IDolittleClient, Builders, DolittleClient } from '@dolittle/sdk';

import { Environment } from './Environment';
import { Middleware } from './Middleware';

type CreateMiddleware = {
    /**
     * Creates a Dolittle middleware to add resources to the incoming request objects.
     * Using the default setup and connect configuration.
     * @returns {RequestHandler} The middleware.
     */
    (): RequestHandler;

    /**
     * Creates a Dolittle middleware to add resources to the incoming request objects.
     * Using the provided connected {@link IDolittleClient} to provide the resources.
     * @param {IDolittleClient} client - The connected Dolittle client to use.
     * @returns {RequestHandler} The middleware.
     */
    (client: IDolittleClient): RequestHandler;

    /**
     * Creates a Dolittle middleware to add resources to the incoming request objects.
     * Using the provided callbacks to setup and connect the Dolittle client.
     * @param {Builders.SetupCallback} [setup] - The optional setup callback to use to configure the Dolittle client.
     * @param {Builders.ConnectCallback} [connect] - The optional connect callback to use to configure the Dolittle client.
     * @returns {RequestHandler} The middleware.
     */
    (setup?: Builders.SetupCallback, connect?: Builders.ConnectCallback): RequestHandler;
};

const connectAndSetClient = (middleware: Middleware, setup?: Builders.SetupCallback, connect?: Builders.ConnectCallback): void => {
    setTimeout(async () => {
        if (setup === undefined) setup = () => {};
        if (connect === undefined) connect = () => {};

        const client = await DolittleClient.setup(setup).connect(connect);
        middleware.client = client;
    }, 0);
};

export const dolittle: CreateMiddleware = (
    maybeClientOrSetup?: IDolittleClient | Builders.SetupCallback,
    maybeConnect?: Builders.ConnectCallback): RequestHandler => {

    const environment = new Environment();
    const middleware = new Middleware(environment);

    if (typeof maybeClientOrSetup === 'function' || maybeClientOrSetup === undefined) {
        connectAndSetClient(middleware, maybeClientOrSetup, maybeConnect);
    } else {
        middleware.client = maybeClientOrSetup;
    }

    return middleware.handle.bind(middleware);
};
