// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

/**
 * Represents the unique identifier for a Microservice.
 */
export type MicroserviceId = Guid | string;


/**
 * Represents the identifier for when Microservice is not applicable.
 */
export const notApplicable = Guid.empty;
