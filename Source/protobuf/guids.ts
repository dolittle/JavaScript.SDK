// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Uuid } from '@dolittle/contracts/Protobuf/Uuid_pb';

/**
 * Convert to protobuf representation.
 * @param {Guid} guid - The GUID to convert.
 * @returns {Uuid} The converted UUID.
 */
function toProtobuf(guid: Guid): Uuid {
    const uuid = new Uuid();
    uuid.setValue(new Uint8Array(guid.bytes));
    return uuid;
}

/**
 * Convert to SDK representation.
 * @param {Uuid} uuid - The UUID to convert.
 * @returns {Guid} The converted GUID.
 */
function toSDK(uuid?: Uuid): Guid {
    if (!uuid) {
        return Guid.empty;
    }
    return new Guid(uuid.getValue_asU8());
}

export default {
    toProtobuf,
    toSDK
};

declare module '@dolittle/rudiments' {
    interface Guid {
        toProtobuf(): Uuid
    }
}
/**
 * Convert to protobuf representation.
 * @returns {Uuid} The converted UUID.
 */
Guid.prototype.toProtobuf = function () {
    return toProtobuf(this);
};

declare module '@dolittle/contracts/Protobuf/Uuid_pb' {
    interface Uuid {
        toSDK(): Guid
    }
}
/**
 * Convert to SDK representation.
 * @returns {Guid} The converted GUID.
 */
Uuid.prototype.toSDK = function () {
    return toSDK(this);
};
