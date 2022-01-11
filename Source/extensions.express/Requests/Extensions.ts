// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { request, Request } from 'express';

import { TenantId } from '@dolittle/sdk.execution';

import { IDolittleResources } from './IDolittleResources';
import { ResourcesNotSetOnRequest } from './ResourcesNotSetOnRequest';

const DolittleResourcesPropertyKey = 'dolittle';

declare global {
    namespace Express {
        /** @inheritdoc */
        export interface Request {
            /**
             * Provides access to the resouces provided by a Dolittle Client scoped to the {@link TenantId} of the current request.
             */
            readonly dolittle: IDolittleResources;
        }
    }
}

Object.defineProperty(request, DolittleResourcesPropertyKey, {
    enumerable: false,
    configurable: true,
    get() {
        throw new ResourcesNotSetOnRequest();
    }
});

/**
 * Sets the Dolittle resources property on the provided request.
 * @param {Request} request - The request to set the property on.
 * @param {IDolittleResources} resources - The resources to set.
 */
export const setResourcesOnRequest = (request: Request, resources: IDolittleResources): void => {
    Object.defineProperty(request, DolittleResourcesPropertyKey, {
        enumerable: false,
        configurable: true,
        writable: false,
        value: resources,
    });
};
