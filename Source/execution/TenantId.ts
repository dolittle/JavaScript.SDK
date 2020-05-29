// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

/**
 * Represents the unique identifier of a tenant.
 */
export type TenantId = Guid | string;

/**
 * Gets the unknown tenant
 */
export const unknown: TenantId = Guid.parse('762a4bd5-2ee8-4d33-af06-95806fb73f4e');

/**
 * Gets the system tenant
 */
export const system: TenantId = Guid.parse('762a4bd5-2ee8-4d33-af06-95806fb73f4e');

/**
 * Gets the development tenant
 */
export const development: TenantId = Guid.parse('762a4bd5-2ee8-4d33-af06-95806fb73f4e');
