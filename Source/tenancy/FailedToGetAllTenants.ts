// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
import { Exception } from '@dolittle/rudiments';

/**
 * Exception that gets thrown when getting all tenants fails.
 */

export class FailedToGetAllTenants extends Exception {

    /**
     * Initializes a new instance of the {@link FailedToGetAllTenants} class.
     * @param failureReason The reason for the failure.
     */
    constructor(failureReason: string) {
        super(`Failed to get all tenants because ${failureReason}`);
    }
}
