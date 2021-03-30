// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { DeleteReadModelInstance } from './';


/**
 * Represents possible results of a projection.
 */
export class ProjectionResult {

    /**
     * Signals that the read model instance should be deleted from the read model store.
     */
    static readonly delete: DeleteReadModelInstance = new DeleteReadModelInstance();
}
