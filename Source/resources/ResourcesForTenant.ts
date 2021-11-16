// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IMongoDBResource } from './mongoDB';
import { IResourcesForTenant } from './IResourcesForTenant';

/**
 * Represents an implementation of {@link IResourcesForTenant}.
 */
export class ResourcesForTenant extends IResourcesForTenant {
    /**
     * Initialises a new instance of the {@link ResourcesForTenant} class.
     * @param {IMongoDBResource} mongoDB - The MongoDB resource for the tenant.
     */
    constructor(readonly mongoDB: IMongoDBResource) {
        super();
    }
}
