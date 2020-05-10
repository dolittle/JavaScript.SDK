// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

/**
 * Represents the unique identifier for a Microservice.
 */
export class MicroserviceId extends Guid {
    /**
     * Undefined microservice
     */
    static readonly undefined: MicroserviceId = MicroserviceId.parse('687b52c6-c409-44f9-bcda-286b12ca0daa');
}
