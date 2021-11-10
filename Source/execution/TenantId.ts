// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { ConceptAs } from '@dolittle/concepts';

export type TenantIdLike = string | Guid | TenantId;

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
    static system: TenantId = TenantId.from('08831584-e016-42f6-bc5e-c4f098fed42b');

    /**
     * Gets the development tenant
     */
    static development: TenantId = TenantId.from('445f8ea8-1a6f-40d7-b2fc-796dba92dc44');

    /**
     * Creates a {TenantId} from a guid.
     *
     * @static
     * @param {TenantIdLike} id
     * @returns {TenantId}
     */
    static from(id: TenantIdLike): TenantId {
        if (id instanceof TenantId) return id;
        return new TenantId(Guid.as(id));
    };
}
