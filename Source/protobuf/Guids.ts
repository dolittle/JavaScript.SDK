// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Uuid } from '@dolittle/contracts/Protobuf/Uuid_pb';

/**
 * Convert a guid to protobuf representation.
 * @param {Guid} guid - The GUID to convert.
 * @returns {Uuid} The converted UUID.
 */
export function toProtobuf(guid: Guid): Uuid {
    const uuid = new Uuid();
    uuid.setValue(new Uint8Array(guid.bytes));
    return uuid;
}

/**
 * Convert an uuid to SDK representation.
 * @param {Uuid} uuid - The UUID to convert.
 * @returns {Guid} The converted GUID.
 */
export function toSDK(uuid?: Uuid): Guid {
    if (!uuid) {
        return Guid.empty;
    }
    return new Guid(uuid.getValue_asU8());
}
