// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { TenantId } from '@dolittle/sdk.execution';
import { ResourceName } from './ResourceName';

/**
 * Defines the base of a resource.
 */
export abstract class IResource {
    /**
     * Gets the name of the resource.
     */
    protected abstract readonly name: ResourceName;

    /**
     * Gets the {@link TenantId} that this resource belongs to.
     */
    protected abstract readonly tenant: TenantId;
}
