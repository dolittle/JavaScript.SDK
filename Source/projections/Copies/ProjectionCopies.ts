// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { MongoDBCopies } from './MongoDB/MongoDBCopies';

/**
 * Represents the specification of read model copies to produce for a projection.
 */
export class ProjectionCopies {
    /**
     * Initialises a new instance of the {@link ProjectionCopies} class.
     * @param {MongoDBCopies} mongoDB - The specification of MongoDB read model copies.
     */
    constructor(
        readonly mongoDB: MongoDBCopies,
    ) {}
}
