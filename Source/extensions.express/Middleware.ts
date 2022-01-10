// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IDolittleClient } from '@dolittle/sdk';
import { NextFunction, Request, Response } from 'express';

/**
 * Represents an ExpressJS middleware that makes Dolittle resources available on the incoming request objects.
 */
export class Middleware {
    private _connectedClient?: IDolittleClient;

    /**
     * Sets the connected Dolittle client to use in the middleware to provide resources on incoming requests.
     */
    set client(client: IDolittleClient) {
        this.throwIfClientNotConnected(client);
        this._connectedClient = client;
    }

    /**
     * Handles incoming requests.
     * @param {Request} request - The request instance.
     * @param {Response} response - The response instance.
     * @param {NextFunction} next - The function to call the next middleware.
     */
    handle(request: Request, response: Response, next: NextFunction): void {
        console.log('Client', this._connectedClient);

        next();
    }

    private throwIfClientNotConnected(client: IDolittleClient) {
    }
}
