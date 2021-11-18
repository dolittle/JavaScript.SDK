// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IMongoDBResource } from './mongoDB';
import { IResources } from './IResources';

/**
 * Represents an implementation of {@link IResources}.
 */
export class Resources extends IResources {
    /**
     * Initialises a new instance of the {@link Resources} class.
     * @param {IMongoDBResource} mongoDB - The MongoDB resource for the tenant.
     */
    constructor(readonly mongoDB: IMongoDBResource) {
        super();
    }
}
