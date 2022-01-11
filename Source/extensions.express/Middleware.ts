// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { NextFunction, Request, Response } from 'express';
import { Logger } from 'winston';

import { IDolittleClient, Builders } from '@dolittle/sdk';
import { TenantId } from '@dolittle/sdk.execution';

import { DolittleResources } from './Requests/DolittleResources';
import { setResourcesOnRequest } from './Requests/Extensions';
import { ClientMustBeConnected } from './ClientMustBeConnected';
import { IEnvironment } from './IEnvironment';

/**
 * Represents an ExpressJS middleware that makes Dolittle resources available on the incoming request objects.
 */
export class Middleware {
    public static readonly TenantIdHeader = 'Tenant-ID';

    private _logger: Logger;
    private _connectedClient?: IDolittleClient;

    /**
     * Initialises a new instance of the {@link Middleware} class.
     * @param {IEnvironment} _environment - The current ExpressJS Node environment.
     */
    constructor(
        private readonly _environment: IEnvironment
    ) {
        this._logger = Builders.createDefaultLogger();
    }

    /**
     * Sets the connected Dolittle client to use in the middleware to provide resources on incoming requests.
     */
    set client(client: IDolittleClient) {
        this.throwIfClientNotConnected(client);
        this._connectedClient = client;
        this._logger = client.logger;
    }

    /**
     * Handles incoming requests.
     * @param {Request} request - The request instance.
     * @param {Response} response - The response instance.
     * @param {NextFunction} next - The function to call the next middleware.
     */
    handle(request: Request, response: Response, next: NextFunction): void {
        if (this._connectedClient === undefined) {
            this._logger.error('Dolittle client is not ready. The resources will not be set on the request.');
        } else {
            const [resolvedTenant, tenant] = this.resolveTenantFor(request, response);

            if (resolvedTenant) {
                const resources = new DolittleResources(this._connectedClient, tenant!);
                setResourcesOnRequest(request, resources);
            } else {
                this._logger.error('Tenant id could not be resolved. The resources will not be set on the request.');
            }
        }
        next();
    }

    private resolveTenantFor(request: Request, response: Response): [true, TenantId] | [false] {
        const [hasTenantIdHeader, tenantIdFromHeader] =  this.parseTenantIdHeader(request);
        if (hasTenantIdHeader) {
            return [true, tenantIdFromHeader!];
        }

        if (!this._environment.isDevelopment) {
            this._logger.error('No Tenant id provided by header in non-development environment.');
            return [false];
        }

        const availableTenantIds = this._connectedClient!.tenants.map(_ => _.id);

        if (availableTenantIds.length < 1) {
            this._logger.error('No Tenants configured for this microservice.');
            return [false];
        }

        if (availableTenantIds.find(_ => _.equals(TenantId.development))) {
            this._logger.debug('No Tenant id provided by header, falling back to Development tenant.');
            return [true, TenantId.development];
        }

        const firstConfiguredTenantId = availableTenantIds[0];
        this._logger.debug(`No Tenant id provided by header, falling back to the first configured tenant ${firstConfiguredTenantId}`);
        return [true, firstConfiguredTenantId];
    }

    private parseTenantIdHeader(request: Request): [false] | [true, TenantId] {
        try {
            const header = request.header(Middleware.TenantIdHeader);
            if (header === undefined) {
                return [false];
            }
            return [true, TenantId.from(header)];
        } catch {
            return [false];
        }
    }

    private throwIfClientNotConnected(client: IDolittleClient) {
        if (!client.connected) {
            throw new ClientMustBeConnected();
        }
    }
}
