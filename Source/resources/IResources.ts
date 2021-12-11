// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IMongoDBResource } from './MongoDB/IMongoDBResource';

/**
 * Defines a system that know about all the resources for a tenant.
 */
export abstract class IResources {
    /**
     * Gets the {@link IMongoDBResource}.
     */
    abstract readonly mongoDB: IMongoDBResource;
}
