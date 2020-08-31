// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { ConceptAs } from '@dolittle/concepts';

/**
 * Represents the unique identifier of a tenant.
 */
export class TenantId extends ConceptAs<Guid, '@dolittle/sdk.execution.TenantId'> {
    constructor(id: Guid) {
        super(id, '@dolittle/sdk.execution.TenantId');
    }

    /**
     * Gets the unknown tenant
     */
    static unknown: TenantId = TenantId.from('762a4bd5-2ee8-4d33-af06-95806fb73f4e');

    /**
     * Gets the system tenant
     */
    static system: TenantId = TenantId.from('762a4bd5-2ee8-4d33-af06-95806fb73f4e');

    /**
     * Gets the development tenant
     */
    static development: TenantId = TenantId.from('762a4bd5-2ee8-4d33-af06-95806fb73f4e');

    /**
     * Creates a {TenantId} from a guid.
     *
     * @static
     * @param {(string | Guid)} id
     * @returns {TenantId}
     */
    static from(id: string | Guid): TenantId {
        return new TenantId(Guid.as(id));
    };
}
