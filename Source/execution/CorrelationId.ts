// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

/**
 * A unique identifier to allow us to trace actions and their consequences throughout the system.
 */
export type CorrelationId = Guid | string;

/**
 * Represents the system correlation identifier
 */
export const system = Guid.parse('868ff40f-a133-4d0f-bfdd-18d726181e01');

